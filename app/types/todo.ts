export type Priority = 'high' | 'medium' | 'low'

export type Task = {
  id: string
  text: string
  completed: boolean
  dueDate?: string // "YYYY-MM-DD"
  priority: Priority
}
