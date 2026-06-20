export interface CurrentWeatherData {
  name: string
  main: {
    temp: number
    feels_like: number
    humidity: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
}

export interface ForecastItem {
  dt: number
  dt_txt: string
  main: {
    temp: number
    temp_min: number
    temp_max: number
    humidity: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  pop: number
  wind: {
    speed: number
  }
}

export interface ForecastApiResponse {
  list: ForecastItem[]
  city: {
    name: string
  }
}

export interface DailyForecast {
  date: string
  dayLabel: string
  tempMax: number
  tempMin: number
  humidity: number
  precipitation: number
  windSpeed: number
  icon: string
  description: string
}
