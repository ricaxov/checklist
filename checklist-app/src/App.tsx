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
    // logar login
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])
  
  // essa parte daqui ta errada, tem que continuar fazendo o crud e fazer a parte do create ( eu so copiei o read)
  useEffect(() => {
    // criar create
    if (!session) return

    async function createTask() {
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

    createTask()
  }, [session])

  useEffect(() => {
    // buscar read
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

  // update
  // delete

  const activeTasks = tasks.filter((task) => task.completedAt === null)
  const doneTasks = tasks.filter((task) => task.completedAt !== null)

  function handleToggleDone(id: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completedAt: task.completedAt ? null : new Date().toISOString(),
            }
          : task,
      ),
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
      <TaskForm />
      <TaskTable
        heading="Active"
        tasks={activeTasks}
        onToggleDone={handleToggleDone}
      />
      <TaskTable
        heading="Done"
        tasks={doneTasks}
        onToggleDone={handleToggleDone}
      />
    </div>
  )
}
