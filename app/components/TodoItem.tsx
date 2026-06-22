'use client'

import { useState } from 'react'
import type { Task, Priority } from '../types/todo'

const priorityLabel: Record<Priority, string> = { high: '高', medium: '中', low: '低' }

const priorityBadge: Record<Priority, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-500',
}

const priorityActiveBtn: Record<Priority, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-200 text-gray-600',
}

type DueDateStatus = 'overdue' | 'today' | 'tomorrow' | 'upcoming'

function getDueDateStatus(dueDate: string): DueDateStatus {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [year, month, day] = dueDate.split('-').map(Number)
  const due = new Date(year, month - 1, day)

  if (due < today) return 'overdue'
  if (due.getTime() === today.getTime()) return 'today'
  if (due.getTime() === tomorrow.getTime()) return 'tomorrow'
  return 'upcoming'
}

function formatDueDate(dueDate: string): string {
  const [, month, day] = dueDate.split('-').map(Number)
  return `${month}/${day}`
}

const statusStyles: Record<DueDateStatus, string> = {
  overdue: 'text-red-600 font-medium',
  today: 'text-orange-500 font-medium',
  tomorrow: 'text-orange-400',
  upcoming: 'text-gray-400',
}

const statusPrefix: Record<DueDateStatus, string> = {
  overdue: '期限切れ ',
  today: '今日 ',
  tomorrow: '明日 ',
  upcoming: '',
}

type Props = {
  task: Task
  onToggle: () => void
  onDelete: () => void
  onSave: (id: string, text: string, dueDate: string | undefined, priority: Priority) => void
}

export default function TodoItem({ task, onToggle, onDelete, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(task.text)
  const [editDueDate, setEditDueDate] = useState(task.dueDate ?? '')
  const [editPriority, setEditPriority] = useState<Priority>(task.priority)

  function handleSave() {
    const trimmed = editText.trim()
    if (!trimmed) return
    onSave(task.id, trimmed, editDueDate || undefined, editPriority)
    setIsEditing(false)
  }

  function handleCancel() {
    setEditText(task.text)
    setEditDueDate(task.dueDate ?? '')
    setEditPriority(task.priority)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <li className="bg-white rounded-lg px-4 py-3 shadow-sm border border-indigo-200">
        <div className="flex flex-col gap-2">
          <input
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSave()
              if (e.key === 'Escape') handleCancel()
            }}
            autoFocus
            aria-label="タスクを編集"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 whitespace-nowrap">優先度</span>
            <div className="flex gap-1">
              {(['high', 'medium', 'low'] as Priority[]).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setEditPriority(p)}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                    editPriority === p
                      ? priorityActiveBtn[p]
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {priorityLabel[p]}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor={`due-${task.id}`} className="text-xs text-gray-500 whitespace-nowrap">
              期限
            </label>
            <input
              id={`due-${task.id}`}
              type="date"
              value={editDueDate}
              onChange={e => setEditDueDate(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {editDueDate && (
              <button
                onClick={() => setEditDueDate('')}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                削除
              </button>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              disabled={!editText.trim()}
              className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-500 disabled:opacity-40 transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </li>
    )
  }

  const status = task.dueDate ? getDueDateStatus(task.dueDate) : null

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
          task.completed ? 'line-through text-gray-400' : 'text-gray-900'
        }`}
      >
        {task.text}
      </span>
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${priorityBadge[task.priority]}`}
      >
        {priorityLabel[task.priority]}
      </span>
      {task.dueDate && status && (
        <span className={`text-xs whitespace-nowrap ${statusStyles[status]}`}>
          {statusPrefix[status]}{formatDueDate(task.dueDate)}
        </span>
      )}
      <button
        onClick={() => setIsEditing(true)}
        aria-label={`「${task.text}」を編集`}
        className="opacity-0 group-hover:opacity-60 focus:opacity-60 hover:!opacity-100 text-gray-400 hover:text-indigo-500 transition-all flex-shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
        </svg>
      </button>
      <button
        onClick={onDelete}
        aria-label={`「${task.text}」を削除`}
        className="opacity-0 group-hover:opacity-60 focus:opacity-60 hover:!opacity-100 text-gray-400 hover:text-red-500 transition-all text-xl leading-none px-1 flex-shrink-0"
      >
        ×
      </button>
    </li>
  )
}
