import TypewriterText from "../TypewriterText";

function OverviewSection({ title, subtitle, timetables, metrics, onDelete, compact = false, latestTimetable }) {
  const latest = timetables[0];

  return (
    <div className="section-grid">
      <article className="panel wide-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Overview</p>
            <h3>{title}</h3>
            <p className="panel-copy">{subtitle}</p>
          </div>
        </div>

        {latest?.schedule?.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Slot</th>
                  <th>Course</th>
                  <th>Faculty</th>
                  <th>Room</th>
                </tr>
              </thead>
              <tbody>
                {latest.schedule.map((item, index) => (
                  <tr key={`${item.day}-${item.slot}-${index}`}>
                    <td>{item.day}</td>
                    <td>{item.slot}</td>
                    <td>{item.course}</td>
                    <td>{item.faculty}</td>
                    <td>{item.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="panel-copy">No generated timetable saved yet. Use Generate to create one.</p>
        )}
      </article>

      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">AI summary</p>
            <h3>Recent entries and generated narrative</h3>
          </div>
        </div>
        <div className="ai-chat-card compact-chat">
          <div className="chat-bubble assistant">
            <TypewriterText
              text={
                latestTimetable?.explanation ||
                "Generate a timetable and the AI explanation will stream here line by line, similar to a conversational assistant."
              }
              speed={12}
            />
          </div>
        </div>
        <div className="card-stack">
          {timetables.length ? (
            timetables.slice(0, compact ? 8 : 4).map((item) => (
              <div key={item.id} className="mini-card">
                <div>
                  <strong>{item.section}</strong>
                  <p className="panel-copy">{item.department}</p>
                </div>
                <button type="button" className="text-btn" onClick={() => onDelete(item.id)}>
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="panel-copy">Generated data will appear here after saving.</p>
          )}
        </div>
        <div className="card-stack metric-stack">
          {metrics.map((metric) => (
            <div key={metric.label} className="mini-card">
              <div>
                <strong>{metric.label}</strong>
                <p className="panel-copy">{metric.detail}</p>
              </div>
              <span className="metric-chip">{metric.value}</span>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

export default OverviewSection;
