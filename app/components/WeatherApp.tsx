'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CurrentWeatherData, DailyForecast } from '@/app/types/weather'
import CitySearch from './CitySearch'
import CurrentWeather from './CurrentWeather'
import WeeklyCalendar from './WeeklyCalendar'
import ForecastDetail from './ForecastDetail'
import ClothingAdvice from './ClothingAdvice'
import RainAlert from './RainAlert'
import FavoritesList from './FavoritesList'
import { useFavorites } from '@/app/lib/useFavorites'

type GradientKey = 'clear' | 'clouds' | 'rain' | 'snow' | 'thunder' | 'default'

const GRADIENTS: Record<GradientKey, string> = {
  clear: 'from-sky-400 to-blue-600',
  clouds: 'from-slate-400 to-slate-600',
  rain: 'from-blue-600 to-indigo-900',
  snow: 'from-sky-200 to-blue-400',
  thunder: 'from-gray-600 to-gray-900',
  default: 'from-sky-500 to-indigo-700',
}

function getGradient(main?: string): string {
  if (!main) return GRADIENTS.default
  const key = main.toLowerCase()
  if (key === 'clear') return GRADIENTS.clear
  if (key === 'clouds') return GRADIENTS.clouds
  if (key.includes('rain') || key === 'drizzle' || key === 'mist') return GRADIENTS.rain
  if (key === 'snow') return GRADIENTS.snow
  if (key === 'thunderstorm') return GRADIENTS.thunder
  return GRADIENTS.default
}

export default function WeatherApp() {
  const [current, setCurrent] = useState<CurrentWeatherData | null>(null)
  const [forecast, setForecast] = useState<DailyForecast[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cityName, setCityName] = useState('Tokyo')
  const { favorites, add, remove, moveLeft, moveRight } = useFavorites()

  const fetchWeather = useCallback(async (params: string) => {
    setLoading(true)
    setError(null)
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`/api/weather?${params}`),
        fetch(`/api/forecast?${params}`),
      ])

      if (!weatherRes.ok) {
        const body = await weatherRes.json()
        throw new Error(body.error ?? '天気データの取得に失敗しました')
      }
      if (!forecastRes.ok) {
        const body = await forecastRes.json()
        throw new Error(body.error ?? '予報データの取得に失敗しました')
      }

      const [weatherData, forecastData] = await Promise.all([
        weatherRes.json() as Promise<CurrentWeatherData>,
        forecastRes.json() as Promise<DailyForecast[]>,
      ])

      setCurrent(weatherData)
      setForecast(forecastData)
      setCityName(weatherData.name)
      if (forecastData.length > 0) {
        setSelectedDate(forecastData[0].date)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '不明なエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWeather('city=Tokyo')
  }, [fetchWeather])

  function handleSearch(city: string) {
    fetchWeather(`city=${encodeURIComponent(city)}`)
  }

  function handleLocate() {
    if (!navigator.geolocation) {
      setError('このブラウザでは位置情報が利用できません')
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lon } = pos.coords
        fetchWeather(`lat=${lat}&lon=${lon}`)
      },
      () => {
        setLoading(false)
        setError('位置情報の取得に失敗しました')
      },
    )
  }

  const gradient = getGradient(current?.weather[0]?.main)
  const selectedDay = forecast.find(d => d.date === selectedDate)

  return (
    <main className={`min-h-screen bg-gradient-to-br ${gradient} transition-all duration-700`}>
      <div className="max-w-sm mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-6">
          <h1 className="text-white/80 text-sm font-medium mb-1">天気予報</h1>
          <div className="flex items-center justify-between">
            <p className="text-white text-2xl font-bold">{cityName}</p>
            {current && (
              <button
                onClick={() => favorites.includes(cityName) ? remove(cityName) : add(cityName)}
                disabled={!favorites.includes(cityName) && favorites.length >= 5}
                className="text-2xl transition-opacity disabled:opacity-30"
                aria-label={favorites.includes(cityName) ? 'お気に入りから削除' : 'お気に入りに追加'}
              >
                {favorites.includes(cityName) ? '★' : '☆'}
              </button>
            )}
          </div>
        </div>

        {/* 検索バー */}
        <CitySearch onSearch={handleSearch} onLocate={handleLocate} loading={loading} />

        {/* お気に入り都市 */}
        <FavoritesList
          favorites={favorites}
          currentCity={cityName}
          onSelect={handleSearch}
          onRemove={remove}
          onMoveLeft={moveLeft}
          onMoveRight={moveRight}
        />

        {/* エラー */}
        {error && (
          <div className="mt-3 rounded-xl bg-red-500/20 border border-red-400/30 px-4 py-3 text-sm text-white">
            ⚠️ {error}
          </div>
        )}

        {/* ローディング */}
        {loading && (
          <div className="mt-8 text-center text-white/70 text-sm animate-pulse">データを取得中...</div>
        )}

        {/* 現在の天気 */}
        {!loading && current && (
          <>
            <CurrentWeather data={current} />

            {/* 服装アドバイス */}
            <ClothingAdvice feelsLike={current.main.feels_like} />

            {/* 雨予報アラート */}
            {selectedDay && <RainAlert precipitation={selectedDay.precipitation} />}

            {/* 週間カレンダー */}
            {forecast.length > 0 && (
              <WeeklyCalendar
                forecast={forecast}
                selectedDate={selectedDate}
                onSelect={setSelectedDate}
              />
            )}

            {/* 選択日の詳細 */}
            {selectedDay && <ForecastDetail day={selectedDay} />}
          </>
        )}
      </div>
    </main>
  )
}
