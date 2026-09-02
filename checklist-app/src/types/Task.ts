export interface Task {
  id: string
  userId: string
  description: string
  dueAt: string
  importance: number
  completedAt: string | null
}
