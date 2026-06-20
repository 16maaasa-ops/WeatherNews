import { NextRequest } from 'next/server'
import type { ForecastApiResponse, DailyForecast } from '@/app/types/weather'
import { geocodeCity } from '@/app/lib/geocode'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey || apiKey === 'your_api_key_here') {
    return Response.json({ error: 'API キーが設定されていません' }, { status: 500 })
  }

  let resolvedLat: string
  let resolvedLon: string

  if (lat && lon) {
    resolvedLat = lat
    resolvedLon = lon
  } else if (city) {
    const geo = await geocodeCity(city, apiKey)
    if (!geo) {
      return Response.json({ error: '都市が見つかりません' }, { status: 404 })
    }
    resolvedLat = String(geo.lat)
    resolvedLon = String(geo.lon)
  } else {
    return Response.json({ error: 'city または lat/lon が必要です' }, { status: 400 })
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${resolvedLat}&lon=${resolvedLon}&appid=${apiKey}&units=metric&lang=ja`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    return Response.json({ error: body.message ?? '予報データの取得に失敗しました' }, { status: res.status })
  }

  const data: ForecastApiResponse = await res.json()

  const grouped: Record<string, typeof data.list> = {}
  for (const item of data.list) {
    const date = item.dt_txt.slice(0, 10)
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(item)
  }

  const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土']
  const today = new Date().toISOString().slice(0, 10)

  const daily: DailyForecast[] = Object.entries(grouped)
    .filter(([date]) => date >= today)
    .slice(0, 5)
    .map(([date, items]) => {
      const d = new Date(date + 'T00:00:00')
      const dayLabel = date === today ? '今日' : `${d.getMonth() + 1}/${d.getDate()}(${DAY_NAMES[d.getDay()]})`
      const midday = items.find(i => i.dt_txt.includes('12:00:00')) ?? items[Math.floor(items.length / 2)]
      // 夜用アイコン（末尾 n）は昼用（d）に変換して暗い背景でも見えるようにする
      const icon = midday.weather[0].icon.replace(/n$/, 'd')
      return {
        date,
        dayLabel,
        tempMax: Math.round(Math.max(...items.map(i => i.main.temp_max))),
        tempMin: Math.round(Math.min(...items.map(i => i.main.temp_min))),
        humidity: Math.round(items.reduce((s, i) => s + i.main.humidity, 0) / items.length),
        precipitation: Math.round(Math.max(...items.map(i => i.pop)) * 100),
        windSpeed: Math.round(midday.wind.speed * 10) / 10,
        icon,
        description: midday.weather[0].description,
      }
    })

  return Response.json(daily)
}
