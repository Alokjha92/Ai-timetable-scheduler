import Icon from "./Icon";

function AuthPage({ mode, form, status, onFieldChange, onSubmit, onSendOtp, onSwitchMode, onBack }) {
  const isSignup = mode === "signup";

  return (
    <div className="auth-screen">
      <div className="ambient-orb orb-three" />
      <div className="ambient-orb orb-four" />
      <div className="auth-shell">
      <section className="auth-side">
        <button type="button" className="ghost-btn auth-back-btn" onClick={onBack}>
          <span className="back-btn-icon">
            <Icon name="arrowLeft" />
          </span>
          Back
        </button>
        <div className="auth-brand-row">
          <div className="brand-badge">ST</div>
          <div className="status-badge">Workspace access</div>
        </div>
        <p className="eyebrow">Secure access</p>
        <h2>{isSignup ? "Create a modern timetable workspace for your team" : "Welcome back to your scheduling workspace"}</h2>
        <p className="hero-text">
          Login or sign up to manage timetable generation, analytics, saved history, and AI-based
          scheduling decisions from one polished product flow.
        </p>
        <div className="auth-side-grid">
          <article className="auth-side-card">
            <p className="eyebrow">Live workflow</p>
            <strong>Generate timetables with guided progress states</strong>
          </article>
          <article className="auth-side-card">
            <p className="eyebrow">Operational clarity</p>
            <strong>View faculty, room, and course planning in one place</strong>
          </article>
        </div>
      </section>

      <section className="auth-card">
        <div className="auth-card-glow" />
        <p className="eyebrow">{isSignup ? "Sign up" : "Login"}</p>
        <h3>{isSignup ? "Create account" : "Access dashboard"}</h3>
        <p className="panel-copy auth-card-copy">
          {isSignup
            ? "Set up your profile and verify your email with OTP to start building better timetables."
            : "Enter your email and verify with OTP to continue into the workspace."}
        </p>
        <form className="generator-form" onSubmit={onSubmit}>
          {isSignup ? (
            <label>
              <span>Full name</span>
              <input
                placeholder="Ayush Kumar"
                value={form.fullName}
                onChange={(event) => onFieldChange("fullName", event.target.value)}
              />
            </label>
          ) : null}
          <label>
            <span>Email</span>
            <input
              type="email"
              placeholder="admin@smarttimetable.ai"
              value={form.email}
              onChange={(event) => onFieldChange("email", event.target.value)}
            />
          </label>
          {isSignup ? (
            <label>
              <span>Organization</span>
              <input
                placeholder="Department of Computer Science"
                value={form.organization || ""}
                onChange={(event) => onFieldChange("organization", event.target.value)}
              />
            </label>
          ) : null}
          {status.otpSent ? (
            <label>
              <span>Enter OTP</span>
              <input
                className="otp-input"
                inputMode="numeric"
                maxLength="6"
                placeholder="6-digit OTP"
                value={form.otp}
                onChange={(event) => onFieldChange("otp", event.target.value.replace(/\D/g, "").slice(0, 6))}
              />
            </label>
          ) : null}
          {status.helper ? <p className="auth-feedback success">{status.helper}</p> : null}
          {status.error ? <p className="auth-feedback error">{status.error}</p> : null}
          <button type="submit" className="primary-btn full-width">
            {status.sendingOtp
              ? "Sending OTP..."
              : status.otpSent
                ? isSignup
                  ? "Verify OTP & Create Account"
                  : "Verify OTP & Login"
                : "Send OTP"}
          </button>
        </form>
        <div className="auth-inline-actions">
          {status.otpSent ? (
            <button type="button" className="ghost-btn" onClick={onSendOtp}>
              Resend OTP
            </button>
          ) : null}
          <button type="button" className="text-btn" onClick={onSwitchMode}>
            {isSignup ? "Already have an account? Login" : "Need an account? Sign up"}
          </button>
        </div>
      </section>
      </div>
    </div>
  );
}

export default AuthPage;
