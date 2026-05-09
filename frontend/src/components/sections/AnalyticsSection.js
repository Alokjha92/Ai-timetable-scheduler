function AnalyticsSection({ analytics, timetables }) {
  const items = analytics
    ? [
        {
          title: "Constraint Score",
          value: `${analytics.constraintScore}%`,
          description: "How well the generated timetable satisfied hard and soft rules.",
        },
        {
          title: "Faculty Utilization",
          value: `${analytics.facultyUtilization}%`,
          description: "Measures balance across faculty assignments.",
        },
        {
          title: "Room Utilization",
          value: `${analytics.roomUtilization}%`,
          description: "Shows how efficiently rooms were selected.",
        },
      ]
    : [
        {
          title: "No analytics yet",
          value: "Generate",
          description: "Create a timetable to calculate analytics.",
        },
      ];

  return (
    <div className="card-grid analytics-grid">
      {items.map((item) => (
        <article key={item.title} className="panel analytics-card animated-card">
          <p className="eyebrow">Animated analytics</p>
          <h3>{item.title}</h3>
          <strong className="score">{item.value}</strong>
          <p className="panel-copy">{item.description}</p>
          <div className="analytics-wave" />
        </article>
      ))}
      <article className="panel analytics-card">
        <p className="eyebrow">History insights</p>
        <h3>Saved generations</h3>
        <strong className="score">{timetables.length}</strong>
        <p className="panel-copy">Every generation is saved and available from History and Settings.</p>
      </article>
    </div>
  );
}

export default AnalyticsSection;
