import Icon from "./Icon";

function DashboardHeader({ activeItem, metrics, error, onBack }) {
  return (
    <section className="dashboard-hero">
      <div>
        <button type="button" className="ghost-btn back-btn" onClick={onBack}>
          <span className="back-btn-icon">
            <Icon name="arrowLeft" />
          </span>
          Back
        </button>
        <p className="eyebrow">Current section</p>
        <h2>{activeItem}</h2>
        <p className="hero-text">
          Build and manage the smart timetable project with persistent data, backend integration,
          and OpenAI API assisted scheduling.
        </p>
        {error ? <p className="error-banner">{error}</p> : null}
      </div>
      <div className="stats-grid">
        {metrics.map((metric) => (
          <article key={metric.label} className="stat-card metric-animate">
            <small>{metric.label}</small>
            <strong>{metric.value}</strong>
            <span>{metric.detail}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DashboardHeader;
