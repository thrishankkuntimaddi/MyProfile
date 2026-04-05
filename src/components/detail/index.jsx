export function ExperienceDetail({ item }) {
  if (!item) return null
  const { company, role, start, end, location, description } = item

  return (
    <>
      <div className="detail-title">{company}</div>
      {role && <div className="detail-role">{role}</div>}
      <div className="detail-period">
        {[
          start && end ? `${start} – ${end}` : start || end,
          location,
        ].filter(Boolean).join(' · ')}
      </div>
      <div className="detail-divider" />

      {description ? (
        <div className="detail-section">
          <div className="detail-section__label">Responsibilities</div>
          <div className="detail-body">{description}</div>
        </div>
      ) : (
        <div className="detail-section">
          <div className="detail-section__body" style={{ color: 'var(--text-muted)' }}>
            No description available.
          </div>
        </div>
      )}
    </>
  )
}

export function EducationDetail({ item }) {
  if (!item) return null
  const { institution, degree, field, start, end, gpa } = item

  return (
    <>
      <div className="detail-title">{institution}</div>
      {(degree || field) && (
        <div className="detail-role">{[degree, field].filter(Boolean).join(' · ')}</div>
      )}
      <div className="detail-period">
        {[
          start && end ? `${start} – ${end}` : start || end,
          gpa && `GPA ${gpa}`,
        ].filter(Boolean).join(' · ')}
      </div>
      <div className="detail-divider" />
    </>
  )
}
