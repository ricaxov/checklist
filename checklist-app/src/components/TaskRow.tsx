import type { Task } from '../types/Task'
import { formatDate } from '../utils/formatDate'

const DONE_CLASSES = 'text-decoration-line-through opacity-50'

interface TaskRowProps {
  task: Task
  onToggleDone: (id: string) => void
}
export function TaskRow({ task, onToggleDone }: TaskRowProps) {
  const taskDone = task.completedAt !== null

  return (
    <tr>
      <td className={taskDone ? DONE_CLASSES : ''}>{task.description}</td>
      <td className={taskDone ? DONE_CLASSES : ''}>{formatDate(task.dueAt)}</td>
      <td>
        <button type="button">Edit</button>
      </td>
      <td>
        <button type="button" onClick={() => onToggleDone(task.id)}>
          {taskDone ? 'Undo' : 'Mark as done'}
        </button>
      </td>
    </tr>
  )
}
