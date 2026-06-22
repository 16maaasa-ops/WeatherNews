'use client'

type Props = {
  overdueCount: number
  nearDueCount: number
  onClose: () => void
}

export default function AlertBanner({ overdueCount, nearDueCount, onClose }: Props) {
  const parts: string[] = []
  if (overdueCount > 0) parts.push(`期限切れ ${overdueCount}件`)
  if (nearDueCount > 0) parts.push(`本日・明日期限 ${nearDueCount}件`)

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed top-0 left-0 right-0 z-40 bg-red-600 text-white shadow-md"
    >
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-medium min-w-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 flex-shrink-0"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <span className="truncate">{parts.join(' ／ ')}</span>
        </div>
        <button
          onClick={onClose}
          aria-label="アラートを閉じる"
          className="flex-shrink-0 text-white/80 hover:text-white transition-colors text-xl leading-none"
        >
          ×
        </button>
      </div>
    </div>
  )
}
