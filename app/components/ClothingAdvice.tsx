interface Props {
  feelsLike: number
}

interface Advice {
  emoji: string
  label: string
  message: string
  bg: string
}

function getAdvice(temp: number): Advice {
  if (temp >= 30) {
    return {
      emoji: '☀️',
      label: '真夏',
      message: '半袖・半ズボン。熱中症対策を',
      bg: 'bg-orange-400/20 border-orange-300/30',
    }
  }
  if (temp >= 25) {
    return {
      emoji: '🌤️',
      label: '夏',
      message: '半袖で快適。日差しに注意',
      bg: 'bg-yellow-400/20 border-yellow-300/30',
    }
  }
  if (temp >= 20) {
    return {
      emoji: '👕',
      label: '春・秋（暖）',
      message: '長袖か薄手のシャツがおすすめ',
      bg: 'bg-green-400/20 border-green-300/30',
    }
  }
  if (temp >= 15) {
    return {
      emoji: '🧥',
      label: '春・秋（涼）',
      message: '軽めのジャケットや羽織りもの',
      bg: 'bg-teal-400/20 border-teal-300/30',
    }
  }
  if (temp >= 10) {
    return {
      emoji: '🧣',
      label: '秋・冬（入口）',
      message: 'コートかウールのジャケットを',
      bg: 'bg-blue-400/20 border-blue-300/30',
    }
  }
  if (temp >= 5) {
    return {
      emoji: '🧤',
      label: '冬',
      message: 'しっかりしたコートと重ね着を',
      bg: 'bg-indigo-400/20 border-indigo-300/30',
    }
  }
  return {
    emoji: '🥶',
    label: '真冬',
    message: '厚手コート・マフラー・手袋必携',
    bg: 'bg-purple-400/20 border-purple-300/30',
  }
}

export default function ClothingAdvice({ feelsLike }: Props) {
  const advice = getAdvice(feelsLike)

  return (
    <div className={`border ${advice.bg} backdrop-blur rounded-2xl px-4 py-3 mt-4 text-white`}>
      <p className="text-xs text-white/60 mb-1">服装アドバイス（体感 {Math.round(feelsLike)}°C）</p>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{advice.emoji}</span>
        <div>
          <p className="text-xs text-white/70">{advice.label}</p>
          <p className="text-sm font-semibold">{advice.message}</p>
        </div>
      </div>
    </div>
  )
}
