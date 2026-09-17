import type { Task } from '../types/Task'
import { formatDate } from '../utils/formatDate'

const DONE_CLASSES = 'text-decoration-line-through text-body-secondary'

interface TaskRowProps {
  task: Task
  onToggleDone: (id: string) => void
  onDelete: (id: string) => void
}
export function TaskRow({ task, onToggleDone, onDelete }: TaskRowProps) {
  const taskDone = task.completedAt !== null
  const toggleLabel = taskDone ? 'Undo' : 'Mark as done'

  return (
    <tr>
      <td className={taskDone ? DONE_CLASSES : ''}>{task.description}</td>
      <td className={`text-nowrap small ${taskDone ? DONE_CLASSES : ''}`}>
        {formatDate(task.dueAt)}
      </td>
      <td>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          title="Delete"
          aria-label="Delete"
          onClick={() => {
            if (confirm('Delete this task?')) onDelete(task.id)
          }}
        >
          ✕
        </button>
      </td>
      <td>
        <button
          type="button"
          className={`btn btn-sm ${taskDone ? 'btn-outline-secondary' : 'btn-outline-success'}`}
          title={toggleLabel}
          aria-label={toggleLabel}
          onClick={() => onToggleDone(task.id)}
        >
          <span style={{ fontSize: taskDone ? '1.2em' : undefined, lineHeight: 1 }}>
            {taskDone ? '↺' : '✓'}
          </span>
        </button>
      </td>
    </tr>
  )
}
