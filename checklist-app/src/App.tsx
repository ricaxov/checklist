import { useEffect, useState } from 'react'
import { TaskTable } from './components/TaskTable'
import { mockTasks } from './data/mock'
import { TaskForm } from './components/TaskForm'
import { LoginForm } from './components/LoginForm'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'

export function App() {
  const [tasks, setTasks] = useState(mockTasks)
  const [session, setSession] = useState<Session | null | undefined>(undefined)

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
