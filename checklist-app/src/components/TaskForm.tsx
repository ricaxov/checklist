const IMPORTANCE_LEVELS = Array.from({ length: 10 }, (_, i) => i + 1)

export function TaskForm() {
  return (
    <form className="row g-2 mb-4">
      <div className="col-12 col-md-5">
        <div className="form-floating">
          <input
            id="task-description"
            type="text"
            className="form-control"
            placeholder="Description"
            required
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
          />
          <label htmlFor="task-due-at">Date</label>
        </div>
      </div>

      <div className="col-5 col-md-2">
        <div className="form-floating">
          <select
            id="task-importance"
            className="form-select"
            defaultValue=""
            required
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
        <button type="button" className="btn btn-success">
          Add
        </button>
      </div>
    </form>
  )
}
