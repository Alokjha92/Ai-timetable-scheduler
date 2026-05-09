const facultyTemplate = { name: "", department: "", availability: "", preference: "" };
const roomTemplate = { name: "", type: "", capacity: "" };
const courseTemplate = { name: "", faculty: "", sessionsPerWeek: 1, preferredRoomType: "" };
const exampleInput = {
  faculty: "Dr. Ahuja | CSE | Mon-Wed 09:00-13:00 | Prefers morning theory slots",
  room: "Lab-204 | Lab | 60",
  course: "AI Fundamentals | Dr. Ahuja | 3 | Lab",
};

function GeneratorSection({
  generatorState,
  onFieldChange,
  onCollectionItemChange,
  onAddCollectionItem,
  onRemoveCollectionItem,
  onGenerate,
}) {
  return (
    <div className="section-grid generator-layout">
      <article className="panel wide-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Generate timetable</p>
            <h3>Enter multiple scheduling inputs</h3>
          </div>
        </div>

        <div className="generator-form">
          <label>
            <span>Department</span>
            <input
              value={generatorState.department}
              onChange={(event) => onFieldChange("department", event.target.value)}
            />
          </label>
          <label>
            <span>Section</span>
            <input
              value={generatorState.section}
              onChange={(event) => onFieldChange("section", event.target.value)}
            />
          </label>
          <label>
            <span>Class strength</span>
            <input
              type="number"
              value={generatorState.strength}
              onChange={(event) => onFieldChange("strength", event.target.value)}
            />
          </label>
          <label className="full-span">
            <span>Scheduling goal</span>
            <textarea
              rows="4"
              value={generatorState.goal}
              onChange={(event) => onFieldChange("goal", event.target.value)}
              placeholder="Example: Keep core subjects before lunch and avoid back-to-back labs."
            />
          </label>
        </div>

        {!generatorState.faculty.length ? (
          <div className="input-help-card helper-copy">
            <p className="panel-copy">Start by adding your own faculty, rooms, and courses.</p>
            <p className="panel-copy">Example Faculty: {exampleInput.faculty}</p>
            <p className="panel-copy">Example Room: {exampleInput.room}</p>
            <p className="panel-copy">Example Course: {exampleInput.course}</p>
          </div>
        ) : null}

        <div className="builder-section">
          <div className="section-title-row">
            <h4>Faculty</h4>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => onAddCollectionItem("faculty", facultyTemplate)}
            >
              Add Faculty
            </button>
          </div>
          {generatorState.faculty.map((item, index) => (
            <div key={`faculty-${index}`} className="multi-input-row faculty-row">
              <input
                placeholder="Dr. Ahuja"
                value={item.name}
                onChange={(event) => onCollectionItemChange("faculty", index, "name", event.target.value)}
              />
              <input
                placeholder="CSE"
                value={item.department}
                onChange={(event) => onCollectionItemChange("faculty", index, "department", event.target.value)}
              />
              <input
                placeholder="Mon-Wed 09:00-13:00"
                value={item.availability}
                onChange={(event) => onCollectionItemChange("faculty", index, "availability", event.target.value)}
              />
              <input
                placeholder="Prefers morning theory slots"
                value={item.preference}
                onChange={(event) => onCollectionItemChange("faculty", index, "preference", event.target.value)}
              />
              <button type="button" className="text-btn" onClick={() => onRemoveCollectionItem("faculty", index)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="builder-section">
          <div className="section-title-row">
            <h4>Rooms</h4>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => onAddCollectionItem("rooms", roomTemplate)}
            >
              Add Room
            </button>
          </div>
          {generatorState.rooms.map((item, index) => (
            <div key={`room-${index}`} className="multi-input-row room-row">
              <input
                placeholder="Lab-204"
                value={item.name}
                onChange={(event) => onCollectionItemChange("rooms", index, "name", event.target.value)}
              />
              <input
                placeholder="Lab"
                value={item.type}
                onChange={(event) => onCollectionItemChange("rooms", index, "type", event.target.value)}
              />
              <input
                placeholder="60"
                value={item.capacity}
                onChange={(event) => onCollectionItemChange("rooms", index, "capacity", event.target.value)}
              />
              <button type="button" className="text-btn" onClick={() => onRemoveCollectionItem("rooms", index)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="builder-section">
          <div className="section-title-row">
            <h4>Courses</h4>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => onAddCollectionItem("courses", courseTemplate)}
            >
              Add Course
            </button>
          </div>
          {generatorState.courses.map((item, index) => (
            <div key={`course-${index}`} className="multi-input-row course-row">
              <input
                placeholder="AI Fundamentals"
                value={item.name}
                onChange={(event) => onCollectionItemChange("courses", index, "name", event.target.value)}
              />
              <input
                placeholder="Dr. Ahuja"
                value={item.faculty}
                onChange={(event) => onCollectionItemChange("courses", index, "faculty", event.target.value)}
              />
              <input
                placeholder="3"
                value={item.sessionsPerWeek}
                onChange={(event) =>
                  onCollectionItemChange("courses", index, "sessionsPerWeek", event.target.value)
                }
              />
              <input
                placeholder="Lab"
                value={item.preferredRoomType}
                onChange={(event) =>
                  onCollectionItemChange("courses", index, "preferredRoomType", event.target.value)
                }
              />
              <button type="button" className="text-btn" onClick={() => onRemoveCollectionItem("courses", index)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <button type="button" className="primary-btn full-width" onClick={onGenerate}>
          Generate Timetable
        </button>
      </article>

      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Generation notes</p>
            <h3>Real flow</h3>
          </div>
        </div>
        <div className="input-help-card">
          <p className="eyebrow">Sample format</p>
          <p className="panel-copy"><strong>Faculty:</strong> {exampleInput.faculty}</p>
          <p className="panel-copy"><strong>Room:</strong> {exampleInput.room}</p>
          <p className="panel-copy"><strong>Course:</strong> {exampleInput.course}</p>
        </div>
        <ul className="detail-list">
          <li>Send multiple faculty, room, and course records to backend</li>
          <li>Persist all saved data in backend storage</li>
          <li>Use OpenAI to help build and explain the timetable</li>
          <li>Teachers appear in timetable when courses are assigned or auto-mapped by backend</li>
          <li>Show a 10 second step-by-step loader during generation</li>
        </ul>
      </article>
    </div>
  );
}

export default GeneratorSection;
