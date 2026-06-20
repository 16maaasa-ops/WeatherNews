import type { DailyForecast } from '@/app/types/weather'

interface Props {
  day: DailyForecast
}

export default function ForecastDetail({ day }: Props) {
  return (
    <div className="bg-white/15 backdrop-blur rounded-2xl p-4 mt-4 text-white">
      <h2 className="text-sm font-semibold text-white/70 mb-3">{day.dayLabel} の詳細</h2>
      <div className="flex items-center gap-3 mb-4">
        <img
          src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
          alt={day.description}
          width={56}
          height={56}
        />
        <div>
          <p className="text-lg font-bold capitalize">{day.description}</p>
          <p className="text-sm text-white/70">最高 {day.tempMax}° / 最低 {day.tempMin}°</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-2xl">💧</p>
          <p className="text-lg font-bold mt-1">{day.precipitation}%</p>
          <p className="text-xs text-white/60 mt-0.5">降水確率</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-2xl">💦</p>
          <p className="text-lg font-bold mt-1">{day.humidity}%</p>
          <p className="text-xs text-white/60 mt-0.5">湿度</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-2xl">💨</p>
          <p className="text-lg font-bold mt-1">{day.windSpeed} <span className="text-xs font-normal">m/s</span></p>
          <p className="text-xs text-white/60 mt-0.5">風速</p>
        </div>
      </div>
    </div>
  )
}
