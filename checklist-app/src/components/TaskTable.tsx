import type { Task } from '../types/Task'
import { TaskRow } from './TaskRow'

interface TaskTableProps {
  tasks: Task[]
  heading: string
  onToggleDone: (id: string) => void
}
export function TaskTable({ heading, tasks, onToggleDone }: TaskTableProps) {
  return (
    <section className="mb-4">
      <h2 className="h5">{heading}</h2>

      <div className="border rounded overflow-hidden">
        <table className="table table-striped align-middle mb-0">
          <thead>
            <tr>
              <th className="w-100">Description</th>
              <th>Date</th>
              <th>
                <span className="visually-hidden">Edit</span>
              </th>
              <th>
                <span className="visually-hidden">Done</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} onToggleDone={onToggleDone} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
