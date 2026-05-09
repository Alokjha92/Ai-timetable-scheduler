function FacultySection({ faculty, title = "Faculty Planning" }) {
  return (
    <article className="panel wide-panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Data table</p>
          <h3>{title}</h3>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {faculty.length
                ? Object.keys(faculty[0]).map((header) => <th key={header}>{header}</th>)
                : null}
            </tr>
          </thead>
          <tbody>
            {faculty.map((item, index) => (
              <tr key={`${title}-${index}`}>
                {Object.values(item).map((value, valueIndex) => (
                  <td key={`${index}-${valueIndex}`}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export default FacultySection;
