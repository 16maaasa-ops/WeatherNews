'use client'

import { useState, useEffect, useRef } from 'react'
import TodoItem, { type Task } from './TodoItem'
import UndoToast from './UndoToast'

type Filter = 'all' | 'active' | 'completed'

type DeletedTask = {
  task: Task
  index: number
}

const STORAGE_KEY = 'todo-tasks'

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [deletedTask, setDeletedTask] = useState<DeletedTask | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setTasks(JSON.parse(saved))
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
    const task: Task = { id: crypto.randomUUID(), text, completed: false }
    setTasks(prev => [task, ...prev])
    setInput('')
    inputRef.current?.focus()
  }

  function toggleTask(id: string) {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  function deleteTask(id: string) {
    let found: Task | undefined
    setTasks(prev => {
      found = prev.find(t => t.id === id)
      return prev.filter(t => t.id !== id)
    })
    if (!found) return

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

  const activeCount = tasks.filter(t => !t.completed).length

  const emptyMessage = {
    all: 'タスクを追加してみましょう！',
    active: '未完了のタスクはありません',
    completed: '完了済みのタスクはありません',
  }[filter]

  if (!hydrated) return null

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">ToDoリスト</h1>

        {/* 入力エリア */}
        <div className="flex gap-2 mb-6">
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

        {/* フィルタータブ */}
        <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1" role="tablist" aria-label="タスクのフィルター">
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

        {/* タスク件数 */}
        <p className="text-xs text-gray-400 mb-3" aria-live="polite">
          未完了: {activeCount}件 / 全{tasks.length}件
        </p>

        {/* タスク一覧 */}
        <ul className="space-y-2" aria-label="タスク一覧">
          {filtered.length === 0 ? (
            <li className="text-center py-12 text-gray-400 text-sm select-none">
              {emptyMessage}
            </li>
          ) : (
            filtered.map(task => (
              <TodoItem
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
              />
            ))
          )}
        </ul>
      </div>

      {deletedTask && (
        <UndoToast taskText={deletedTask.task.text} onUndo={undoDelete} />
      )}
    </main>
  )
}
