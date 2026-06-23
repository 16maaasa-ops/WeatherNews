interface Props {
  precipitation: number
}

export default function RainAlert({ precipitation }: Props) {
  if (precipitation >= 70) {
    return (
      <div className="border border-blue-400/40 bg-blue-500/25 backdrop-blur rounded-2xl px-4 py-3 mt-4 text-white">
        <p className="text-xs text-white/60 mb-1">雨予報アラート（降水確率 {precipitation}%）</p>
        <div className="flex items-center gap-2">
          <span className="text-2xl">☔</span>
          <p className="text-sm font-semibold">雨が降る可能性が高いです。傘を持っていきましょう</p>
        </div>
      </div>
    )
  }

  if (precipitation >= 50) {
    return (
      <div className="border border-sky-400/40 bg-sky-500/20 backdrop-blur rounded-2xl px-4 py-3 mt-4 text-white">
        <p className="text-xs text-white/60 mb-1">雨予報アラート（降水確率 {precipitation}%）</p>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌂</span>
          <p className="text-sm font-semibold">雨が降るかもしれません。折りたたみ傘があると安心</p>
        </div>
      </div>
    )
  }

  return null
}
