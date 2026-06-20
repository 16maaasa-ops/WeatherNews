import type { DailyForecast } from '@/app/types/weather'

interface Props {
  forecast: DailyForecast[]
  selectedDate: string
  onSelect: (date: string) => void
}

export default function WeeklyCalendar({ forecast, selectedDate, onSelect }: Props) {
  return (
    <div className="grid grid-cols-5 gap-2 mt-4">
      {forecast.map(day => {
        const selected = day.date === selectedDate
        return (
          <button
            key={day.date}
            onClick={() => onSelect(day.date)}
            className={`flex flex-col items-center gap-1 rounded-xl p-2 text-xs font-medium transition-colors ${
              selected
                ? 'bg-white text-sky-700 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <span className={selected ? 'font-bold text-sky-700' : 'text-white/80'}>{day.dayLabel}</span>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt={day.description}
              width={36}
              height={36}
            />
            <span className="font-bold text-sm">{day.tempMax}°</span>
            <span className={selected ? 'text-sky-500' : 'text-white/60'}>{day.tempMin}°</span>
          </button>
        )
      })}
    </div>
  )
}
