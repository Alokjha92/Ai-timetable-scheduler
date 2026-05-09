function ForecastSection({ latestTimetable, faculty, rooms, courses }) {
  const demandForecast = [
    {
      title: "Peak room pressure",
      value: latestTimetable ? "Wed 11:30" : "Pending",
      note: "Forecasted using course density and lab demand.",
    },
    {
      title: "Faculty overload risk",
      value: `${Math.max(faculty.length - 1, 1)} low-risk`,
      note: "Helps identify imbalance before final release.",
    },
    {
      title: "Course complexity score",
      value: `${Math.min(courses.length * 12, 98)}%`,
      note: "Estimated scheduling difficulty from course mix.",
    },
    {
      title: "Room buffer",
      value: `${Math.max(rooms.length * 8, 24)}%`,
      note: "Available capacity after current plan allocation.",
    },
  ];

  return (
    <div className="card-grid analytics-grid">
      {demandForecast.map((item) => (
        <article key={item.title} className="panel analytics-card animated-card clean-card">
          <p className="eyebrow">Forecasting</p>
          <h3>{item.title}</h3>
          <strong className="score">{item.value}</strong>
          <p className="panel-copy">{item.note}</p>
          <div className="analytics-wave soft" />
        </article>
      ))}
    </div>
  );
}

export default ForecastSection;
