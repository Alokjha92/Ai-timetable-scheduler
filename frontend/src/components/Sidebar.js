import Icon from "./Icon";

function Sidebar({ items, activeItem, userName, onSelect, onLogout }) {
  return (
    <aside className="dashboard-sidebar">
      <div className="brand-wrap sidebar-brand">
        <div className="brand-badge">ST</div>
        <div>
          <p className="eyebrow">Smart timetable project</p>
          <h1>Workspace</h1>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            className={item.label === activeItem ? "sidebar-item active" : "sidebar-item"}
            onClick={() => onSelect(item.label)}
          >
            <span className="icon-box">
              <Icon name={item.icon} />
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-note">
        <p className="eyebrow">Admin</p>
        <h3>{userName}</h3>
        <p className="panel-copy">
          Manage timetables, delete generated tasks, and review scheduling analytics.
        </p>
        <button type="button" className="ghost-btn sidebar-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
