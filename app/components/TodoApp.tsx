'use client'

import { useState, useEffect, useRef } from 'react'
import TodoItem from './TodoItem'
import UndoToast from './UndoToast'
import AlertBanner from './AlertBanner'
import type { Task, Priority } from '../types/todo'

function getDueDateCategory(dueDate: string): 'overdue' | 'near' | 'future' {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dayAfterTomorrow = new Date(today)
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

  const [year, month, day] = dueDate.split('-').map(Number)
  const due = new Date(year, month - 1, day)

  if (due < today) return 'overdue'
  if (due < dayAfterTomorrow) return 'near'
  return 'future'
}

const priorityLabel: Record<Priority, string> = { high: '高', medium: '中', low: '低' }
const priorityActiveBtn: Record<Priority, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-200 text-gray-600',
}

type Filter = 'all' | 'active' | 'completed'
type SortKey = 'default' | 'priority' | 'dueDate'

const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

function sortTasks(tasks: Task[], key: SortKey): Task[] {
  if (key === 'default') return tasks
  return [...tasks].sort((a, b) => {
    if (key === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority]
    if (!a.dueDate && !b.dueDate) return 0
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return a.dueDate.localeCompare(b.dueDate)
  })
}

type DeletedTask = {
  task: Task
  index: number
}

const STORAGE_KEY = 'todo-tasks'

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [input, setInput] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [filter, setFilter] = useState<Filter>('all')
  const [deletedTask, setDeletedTask] = useState<DeletedTask | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [alertDismissed, setAlertDismissed] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('default')
  const inputRef = useRef<HTMLInputElement>(null)
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const loaded = JSON.parse(saved) as Array<Omit<Task, 'priority'> & { priority?: Priority }>
        setTasks(loaded.map(t => ({ ...t, priority: t.priority ?? 'medium' })))
      }
    } catch {
      // ignore malformed data
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks, hydrated])

  function addTask() {
    const text = input.trim()
    if (!text) return
    const task: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      dueDate: dueDate || undefined,
      priority,
    }
    setTasks(prev => [task, ...prev])
    setInput('')
    setDueDate('')
    setPriority('medium')
    inputRef.current?.focus()
  }

  function toggleTask(id: string) {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  function editTask(id: string, text: string, newDueDate: string | undefined, newPriority: Priority) {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, text, dueDate: newDueDate, priority: newPriority } : t))
    )
  }

  function deleteTask(id: string) {
    const found = tasks.find(t => t.id === id)
    if (!found) return
    setTasks(prev => prev.filter(t => t.id !== id))
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
    setDeletedTask({ task: found, index: 0 })
    undoTimerRef.current = setTimeout(() => setDeletedTask(null), 5000)
  }

  function undoDelete() {
    if (!deletedTask) return
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
    setTasks(prev => [deletedTask.task, ...prev])
    setDeletedTask(null)
  }

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
    }
  }, [])

  const filtered = tasks.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })
  const sorted = sortTasks(filtered, sortKey)

  const activeCount = tasks.filter(t => !t.completed).length

  const overdueCount = tasks.filter(
    t => !t.completed && t.dueDate && getDueDateCategory(t.dueDate) === 'overdue'
  ).length
  const nearDueCount = tasks.filter(
    t => !t.completed && t.dueDate && getDueDateCategory(t.dueDate) === 'near'
  ).length
  const showAlert = !alertDismissed && (overdueCount > 0 || nearDueCount > 0)

  const emptyMessage = {
    all: 'タスクを追加してみましょう！',
    active: '未完了のタスクはありません',
    completed: '完了済みのタスクはありません',
  }[filter]

  if (!hydrated) return null

  return (
    <>
      {showAlert && (
        <AlertBanner
          overdueCount={overdueCount}
          nearDueCount={nearDueCount}
          onClose={() => setAlertDismissed(true)}
        />
      )}
    <main className={`min-h-screen bg-gray-50 pb-12 px-4 ${showAlert ? 'pt-24' : 'pt-12'}`}>
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">ToDoリスト</h1>

        {/* 入力エリア */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.nativeEvent.isComposing && addTask()}
              placeholder="タスクを入力して Enter または「追加」"
              aria-label="新しいタスクを入力"
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={addTask}
              disabled={!input.trim()}
              className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              追加
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 whitespace-nowrap">優先度</span>
            <div className="flex gap-1">
              {(['high', 'medium', 'low'] as Priority[]).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                    priority === p
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
            <label htmlFor="new-due-date" className="text-xs text-gray-500 whitespace-nowrap">
              期限（任意）
            </label>
            <input
              id="new-due-date"
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* フィルタータブ */}
        <div
          className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1"
          role="tablist"
          aria-label="タスクのフィルター"
        >
          {(['all', 'active', 'completed'] as Filter[]).map(f => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f === 'all' ? 'すべて' : f === 'active' ? '未完了' : '完了'}
            </button>
          ))}
        </div>

        {/* タスク件数 + ソート */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-400" aria-live="polite">
            未完了: {activeCount}件 / 全{tasks.length}件
          </p>
          <div className="flex items-center gap-1.5">
            <label htmlFor="sort-key" className="text-xs text-gray-400">
              並び替え
            </label>
            <select
              id="sort-key"
              value={sortKey}
              onChange={e => setSortKey(e.target.value as SortKey)}
              className="text-xs text-gray-600 border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="default">追加順</option>
              <option value="priority">優先度順</option>
              <option value="dueDate">期限順</option>
            </select>
          </div>
        </div>

        {/* タスク一覧 */}
        <ul className="space-y-2" aria-label="タスク一覧">
          {sorted.length === 0 ? (
            <li className="text-center py-12 text-gray-400 text-sm select-none">
              {emptyMessage}
            </li>
          ) : (
            sorted.map(task => (
              <TodoItem
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
                onSave={editTask}
              />
            ))
          )}
        </ul>
      </div>

      {deletedTask && (
        <UndoToast taskText={deletedTask.task.text} onUndo={undoDelete} />
      )}
    </main>
    </>
  )
}
