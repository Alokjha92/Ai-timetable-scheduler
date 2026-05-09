function RoomsSection({ rooms }) {
  return (
    <div className="card-grid">
      {rooms.map((room, index) => (
        <article key={`${room.name}-${index}`} className="panel room-card animated-card">
          <p className="eyebrow">{room.type}</p>
          <h3>{room.name}</h3>
          <p className="panel-copy">Capacity: {room.capacity}</p>
          <div className="room-bar">
            <div className="room-bar-fill" style={{ width: `${Math.min(Number(room.capacity || 0), 100)}%` }} />
          </div>
        </article>
      ))}
    </div>
  );
}

export default RoomsSection;
