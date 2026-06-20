'use client'

export type Task = {
  id: string
  text: string
  completed: boolean
}

type Props = {
  task: Task
  onToggle: () => void
  onDelete: () => void
}

export default function TodoItem({ task, onToggle, onDelete }: Props) {
  return (
    <li className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100 group">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
        aria-label={`「${task.text}」を完了にする`}
        className="h-4 w-4 rounded border-gray-300 accent-indigo-600 cursor-pointer flex-shrink-0"
      />
      <span
        className={`flex-1 text-sm break-all transition-colors ${
          task.completed ? 'line-through text-gray-500' : 'text-gray-900'
        }`}
      >
        {task.text}
      </span>
      <button
        onClick={onDelete}
        aria-label={`「${task.text}」を削除`}
        className="opacity-30 group-hover:opacity-100 focus:opacity-100 text-gray-400 hover:text-red-500 transition-all text-xl leading-none px-1 flex-shrink-0"
      >
        ×
      </button>
    </li>
  )
}
