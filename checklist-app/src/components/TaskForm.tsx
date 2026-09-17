import { useState, type SubmitEvent } from 'react'

const IMPORTANCE_LEVELS = Array.from({ length: 10 }, (_, i) => i + 1)

interface TaskFormProps {
  onCreate: (input: {
    description: string
    dueAt: string
    importance: number
  }) => Promise<void>
}
export function TaskForm({ onCreate }: TaskFormProps) {
  const [description, setDescription] = useState('')
  const [dueAt, setDueAt] = useState('')
  const [importance, setImportance] = useState('')

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    await onCreate({
      description,
      dueAt,
      importance: Number(importance),
    })
    setDescription('')
    setDueAt('')
    setImportance('')
  }

  return (
    <form className="row g-2 mb-4" onSubmit={handleSubmit}>
      <div className="col-12 col-md-5">
        <div className="form-floating">
          <input
            id="task-description"
            type="text"
            className="form-control"
            placeholder="Description"
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <label htmlFor="task-description">Description</label>
        </div>
      </div>

      <div className="col-7 col-md-3">
        <div className="form-floating">
          <input
            id="task-due-at"
            type="datetime-local"
            className="form-control"
            placeholder="Date"
            required
            value={dueAt}
            onChange={(event) => setDueAt(event.target.value)}
          />
          <label htmlFor="task-due-at">Date</label>
        </div>
      </div>

      <div className="col-5 col-md-2">
        <div className="form-floating">
          <select
            id="task-importance"
            className="form-select"
            required
            value={importance}
            onChange={(event) => setImportance(event.target.value)}
          >
            <option value="" disabled>
              -
            </option>
            {IMPORTANCE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <label htmlFor="task-importance">Importance</label>
        </div>
      </div>

      <div className="col-12 col-md-2 d-grid">
        <button type="submit" className="btn btn-success">
          Add
        </button>
      </div>
    </form>
  )
}
