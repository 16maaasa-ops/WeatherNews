import type { CurrentWeatherData } from '@/app/types/weather'

interface Props {
  data: CurrentWeatherData
}

export default function CurrentWeather({ data }: Props) {
  const temp = Math.round(data.main.temp)
  const feelsLike = Math.round(data.main.feels_like)
  const { description, icon } = data.weather[0]

  return (
    <div className="text-center text-white py-4">
      <p className="text-5xl font-bold tracking-tight">{temp}°C</p>
      <div className="flex items-center justify-center gap-1 mt-1">
        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={description}
          width={48}
          height={48}
          className="drop-shadow"
        />
        <span className="text-xl font-medium capitalize">{description}</span>
      </div>
      <p className="text-sm text-white/70 mt-1">体感温度 {feelsLike}°C</p>
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <span>💧 湿度 {data.main.humidity}%</span>
        <span>💨 風速 {data.wind.speed} m/s</span>
      </div>
    </div>
  )
}
