function SettingsSection({ health, timetables, onDelete }) {
  return (
    <div className="section-grid">
      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Admin controls</p>
            <h3>Workspace settings</h3>
          </div>
        </div>
        <ul className="detail-list">
          <li>Backend status: {health?.status || "Checking"}</li>
          <li>OpenAI connection: {health?.ai || "Checking"}</li>
          <li>Model in use: {health?.model || "Checking"}</li>
          <li>Storage: {health?.storage || "Checking"}</li>
          <li>Total saved timetables: {timetables.length}</li>
        </ul>
      </article>

      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Task removal</p>
            <h3>Delete generated timetables</h3>
          </div>
        </div>
        <div className="card-stack">
          {timetables.length ? (
            timetables.map((item) => (
              <div key={item.id} className="mini-card">
                <div>
                  <strong>{item.department}</strong>
                  <p className="panel-copy">
                    {item.section} · {item.createdAt}
                  </p>
                </div>
                <button type="button" className="text-btn" onClick={() => onDelete(item.id)}>
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="panel-copy">No saved timetables available to remove.</p>
          )}
        </div>
      </article>

      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Live controls</p>
            <h3>Workspace toggles</h3>
          </div>
        </div>
        <div className="settings-list">
          <div className="settings-item">
            <span>Enable AI explanation streaming</span>
            <strong>On</strong>
          </div>
          <div className="settings-item">
            <span>Auto-save generated timetable</span>
            <strong>On</strong>
          </div>
          <div className="settings-item">
            <span>Constraint validation alerts</span>
            <strong>Active</strong>
          </div>
          <div className="settings-item">
            <span>Faculty overload warnings</span>
            <strong>Active</strong>
          </div>
        </div>
      </article>
    </div>
  );
}

export default SettingsSection;
