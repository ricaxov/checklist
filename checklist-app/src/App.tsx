import { useState } from 'react'
import { TaskTable } from './components/TaskTable'
import { mockTasks } from './data/mock'
import { TaskForm } from './components/TaskForm'
export function App() {
  const [tasks, setTasks] = useState(mockTasks)

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
