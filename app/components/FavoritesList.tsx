interface Props {
  favorites: string[]
  currentCity: string
  onSelect: (city: string) => void
  onRemove: (city: string) => void
  onMoveLeft: (index: number) => void
  onMoveRight: (index: number) => void
}

export default function FavoritesList({ favorites, currentCity, onSelect, onRemove, onMoveLeft, onMoveRight }: Props) {
  if (favorites.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {favorites.map((city, i) => {
        const isActive = city === currentCity
        return (
          <div
            key={city}
            className={`flex items-center rounded-full text-sm font-medium transition-colors ${
              isActive ? 'bg-white text-sky-700' : 'bg-white/20 text-white'
            }`}
          >
            {i > 0 && (
              <button
                onClick={() => onMoveLeft(i)}
                className="pl-2 pr-1 py-1.5 opacity-50 hover:opacity-100 transition-opacity"
                aria-label="左に移動"
              >
                ‹
              </button>
            )}
            <button
              onClick={() => onSelect(city)}
              className={`py-1.5 ${i === 0 ? 'pl-3' : 'pl-1'} ${i === favorites.length - 1 ? 'pr-3' : 'pr-1'}`}
            >
              {city}
            </button>
            {i < favorites.length - 1 && (
              <button
                onClick={() => onMoveRight(i)}
                className="pl-1 pr-2 py-1.5 opacity-50 hover:opacity-100 transition-opacity"
                aria-label="右に移動"
              >
                ›
              </button>
            )}
            <button
              onClick={() => onRemove(city)}
              className={`pr-2.5 py-1.5 opacity-40 hover:opacity-100 transition-opacity ${i === favorites.length - 1 ? '' : ''}`}
              aria-label="削除"
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
