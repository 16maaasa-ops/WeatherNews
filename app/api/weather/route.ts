import { NextRequest } from 'next/server'
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
  let displayName: string | null = null

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
    displayName = geo.displayName
  } else {
    return Response.json({ error: 'city または lat/lon が必要です' }, { status: 400 })
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${resolvedLat}&lon=${resolvedLon}&appid=${apiKey}&units=metric&lang=ja`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    return Response.json({ error: body.message ?? '天気データの取得に失敗しました' }, { status: res.status })
  }

  const data = await res.json()
  // lat/lon ベースの検索では weather API が国名を返すことがあるため、
  // geocoding の結果で上書きする
  if (displayName) data.name = displayName
  return Response.json(data)
}
