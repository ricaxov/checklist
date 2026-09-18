import { useEffect, useState } from 'react'
import { TaskTable } from './components/TaskTable'
import { TaskForm } from './components/TaskForm'
import { LoginForm } from './components/LoginForm'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import type { Task } from './types/Task'

export function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [isLoadingTasks, setIsLoadingTasks] = useState(true)
  const [tasksError, setTasksError] = useState<string | null>(null)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function handleCreate(input: {
    description: string
    dueAt: string
    importance: number
  }) {
    if (!session) return

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        description: input.description,
        due_at: new Date(input.dueAt).toISOString(),
        importance: input.importance,
        user_id: session.user.id,
      })
      .select(
        'id, userId:user_id, description, dueAt:due_at, importance, completedAt:completed_at',
      )
      .single()
      .returns<Task>()

    if (error) {
      setTasksError(error.message)
      return
    }

    setTasks((currentTasks) => [...currentTasks, data])
  }

  useEffect(() => {
    if (!session) return

    async function loadTasks() {
      setIsLoadingTasks(true)
      setTasksError(null)

      const { data, error } = await supabase
        .from('tasks')
        .select(
          'id, userId:user_id, description, dueAt:due_at, importance, completedAt:completed_at',
        )
        .returns<Task[]>()

      if (error) {
        setTasksError(error.message)
      } else {
        setTasks(data)
      }

      setIsLoadingTasks(false)
    }

    loadTasks()
  }, [session])

  async function handleDelete(id: string) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)

    if (error) {
      setTasksError(error.message)
      return
    }

    setTasks((currentTasks) => currentTasks.filter((t) => t.id !== id))
  }

  const activeTasks = tasks
    .filter((task) => task.completedAt === null)
    .sort(
      (a, b) => a.dueAt.localeCompare(b.dueAt) || b.importance - a.importance,
    )

  const doneTasks = tasks
    .filter((task) => task.completedAt !== null)
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))

  async function handleToggleDone(id: string) {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    const newCompletedAt = task.completedAt ? null : new Date().toISOString()
    const { data, error } = await supabase
      .from('tasks')
      .update({ completed_at: newCompletedAt })
      .eq('id', id)
      .select(
        'id, userId:user_id, description, dueAt:due_at, importance, completedAt:completed_at',
      )
      .single()
      .returns<Task>()

    if (error) {
      setTasksError(error.message)
      return
    }

    setTasks((currentTasks) =>
      currentTasks.map((t) => (t.id === id ? data : t)),
    )
  }

  if (session === undefined) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (session === null) {
    return (
      <div className="container d-flex align-items-center min-vh-100">
        <div className="w-100">
          <LoginForm />
        </div>
      </div>
    )
  }

  if (isLoadingTasks) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (tasksError) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          {tasksError}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <TaskForm onCreate={handleCreate} />
      <TaskTable
        heading="Active"
        tasks={activeTasks}
        onToggleDone={handleToggleDone}
        onDelete={handleDelete}
      />
      <TaskTable
        heading="Done"
        tasks={doneTasks}
        onToggleDone={handleToggleDone}
        onDelete={handleDelete}
      />
    </div>
  )
}
