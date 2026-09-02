export interface Task {
  id: string
  user_id: string
  description: string
  due_at: string
  importance: number
  completed_at: string | null
}
