import { useEffect, useState } from "react";

function LoadingScreen({ title, steps, duration, onComplete }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const intervalDuration = Math.max(800, Math.floor(duration / steps.length));
    const intervalId = window.setInterval(() => {
      setActiveStep((current) => {
        if (current >= steps.length - 1) {
          return current;
        }
        return current + 1;
      });
    }, intervalDuration);

    const timeoutId = window.setTimeout(async () => {
      window.clearInterval(intervalId);
      await onComplete();
    }, duration);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [duration, onComplete, steps.length]);

  return (
    <div className="loading-shell">
      <div className="loading-card">
        <div className="brand-badge">ST</div>
        <p className="eyebrow">Loading</p>
        <h2>{title}</h2>
        <div className="loading-track">
          <div
            className="loading-fill"
            style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <ul className="step-list">
          {steps.map((step, index) => (
            <li key={step} className={index <= activeStep ? "step-item active" : "step-item"}>
              {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LoadingScreen;
