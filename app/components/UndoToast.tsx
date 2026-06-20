'use client'

type Props = {
  taskText: string
  onUndo: () => void
}

export default function UndoToast({ taskText, onUndo }: Props) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-gray-800 text-white px-5 py-3 rounded-full shadow-lg text-sm whitespace-nowrap"
    >
      <span>「{taskText}」を削除しました</span>
      <button
        onClick={onUndo}
        className="font-semibold underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-gray-800 rounded"
      >
        元に戻す
      </button>
    </div>
  )
}
