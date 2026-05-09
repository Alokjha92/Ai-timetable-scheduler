function LandingPage({ onLogin, onSignup }) {
  return (
    <div className="page-shell">
      <div className="ambient-orb orb-one" />
      <div className="ambient-orb orb-two" />
      <div className="grid-glow" />
      <header className="marketing-header">
        <div className="brand-wrap">
          <div className="brand-badge">ST</div>
          <div>
            <p className="eyebrow">Academic scheduling intelligence</p>
            <h1>Smart Timetable</h1>
          </div>
        </div>
        <div className="header-actions">
          <button type="button" className="ghost-btn" onClick={onLogin}>
            Login
          </button>
          <button type="button" className="primary-btn" onClick={onSignup}>
            Sign Up
          </button>
        </div>
      </header>

      <main className="hero-layout">
        <section className="hero-content">
          <span className="hero-pill">AI Scheduling Workspace</span>
          <h2>Turn timetable planning into a product experience, not a manual struggle.</h2>
          <p className="hero-text">
            Build timetables from faculty, room, and course inputs with live analytics, cleaner
            planning flows, and AI-guided generation designed for colleges and departments.
          </p>
          <div className="hero-highlights">
            <div className="highlight-card">
              <span className="highlight-label">Faculty balancing</span>
              <strong>Reduce clashes and overloads</strong>
            </div>
            <div className="highlight-card">
              <span className="highlight-label">Schedule quality</span>
              <strong>Optimize room use and subject flow</strong>
            </div>
          </div>
          <div className="hero-actions">
            <button type="button" className="primary-btn" onClick={onSignup}>
              Create Workspace
            </button>
            <button type="button" className="ghost-btn" onClick={onLogin}>
              Login to Demo
            </button>
          </div>
        </section>

        <section className="hero-preview">
          <div className="preview-panel">
            <div className="preview-topbar">
              <span className="status-dot" />
              <span className="status-dot" />
              <span className="status-dot" />
              <p>Live scheduling board</p>
            </div>
            <div className="preview-dashboard">
              <div className="stats-grid">
                <article className="stat-card">
                  <small>Schedule confidence</small>
                  <strong>97%</strong>
                  <span>Balances clashes, rooms, and faculty load</span>
                </article>
                <article className="stat-card">
                  <small>Generation speed</small>
                  <strong>10 sec</strong>
                  <span>Streams steps while building the final timetable</span>
                </article>
                <article className="stat-card">
                  <small>Planning layer</small>
                  <strong>AI Ready</strong>
                  <span>Uses intelligent generation and explanation flows</span>
                </article>
              </div>
              <div className="preview-timeline">
                <div className="timeline-row">
                  <span>08:30</span>
                  <div className="timeline-pill soft-green">AI Fundamentals · Lab-204</div>
                </div>
                <div className="timeline-row">
                  <span>10:15</span>
                  <div className="timeline-pill soft-blue">DBMS · C-302</div>
                </div>
                <div className="timeline-row">
                  <span>12:00</span>
                  <div className="timeline-pill soft-cream">Operating Systems · C-204</div>
                </div>
              </div>
              <div className="preview-chart" />
            </div>
          </div>
        </section>
      </main>

      <section className="landing-strip">
        <article className="strip-card">
          <p className="eyebrow">Smart inputs</p>
          <h3>Collect faculty, course, and room data in one flow.</h3>
        </article>
        <article className="strip-card">
          <p className="eyebrow">Live generation</p>
          <h3>Show AI progress step by step while the timetable is prepared.</h3>
        </article>
        <article className="strip-card">
          <p className="eyebrow">Admin control</p>
          <h3>Track saved runs, analytics, and workspace settings from one dashboard.</h3>
        </article>
      </section>
    </div>
  );
}

export default LandingPage;
