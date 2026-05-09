import TypewriterText from "../TypewriterText";

function AICopilotSection({ latestTimetable, health }) {
  const isAiReady = health?.ai === "configured";
  const generatedExplanation = latestTimetable?.explanation;

  return (
    <div className="section-grid">
      <article className="panel wide-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">AI copilot</p>
            <h3>Streaming schedule explanation</h3>
            <p className="panel-copy">
              Uses OpenAI for timetable reasoning, scheduling tradeoffs, and operator-friendly summaries.
            </p>
          </div>
          <span className="status-badge">{health?.ai === "configured" ? "Live" : "Check Backend"}</span>
        </div>

        <div className="ai-chat-card">
          <div className="chat-bubble user">
            Build the best timetable using constraints, course demand, and fair faculty distribution.
          </div>
          <div className="chat-bubble assistant">
            {isAiReady && generatedExplanation ? (
              <TypewriterText text={generatedExplanation} />
            ) : (
              <p className="typewriter-text">
                {isAiReady
                  ? "No AI explanation available yet. Generate a timetable to view the live copilot response."
                  : "OpenAI API key is required. AI copilot stays inactive until the backend key is configured."}
              </p>
            )}
          </div>
        </div>
      </article>

      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">ML layer</p>
            <h3>How ML topics fit here</h3>
          </div>
        </div>
        <ul className="detail-list">
          <li>Constraint optimization for timetable feasibility and fairness</li>
          <li>Ranking models for choosing better timetable candidates</li>
          <li>Demand forecasting for high-pressure room and slot planning</li>
          <li>Anomaly detection for faculty overload and room conflicts</li>
          <li>NLP explanation generation for admin-friendly schedule summaries</li>
        </ul>
      </article>
    </div>
  );
}

export default AICopilotSection;
