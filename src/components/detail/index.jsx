import { SectionLabel } from '../shared/SectionLabel'

export function ExperienceDetail({ item }) {
  if (!item) return null
  const { company, role, start, end, location, description } = item

  return (
    <div className="section-inner anim-expand">
      <div className="detail-title">{role || 'Role'}</div>
      <div className="detail-subtitle">
        {company}{location ? ` · ${location}` : ''}
      </div>

      {(start || end) && (
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 'var(--sp-6)' }}>
          {start}{end ? ` – ${end}` : ''}
        </div>
      )}

      {description && (
        <div className="detail-section">
          <div className="detail-section__heading">Description</div>
          <div className="detail-section__body">{description}</div>
        </div>
      )}
    </div>
  )
}

export function EducationDetail({ item }) {
  if (!item) return null
  const { institution, degree, field, start, end, gpa } = item

  return (
    <div className="section-inner anim-expand">
      <div className="detail-title">{institution || 'Institution'}</div>
      <div className="detail-subtitle">
        {[degree, field].filter(Boolean).join(' · ')}
      </div>

      {(start || end) && (
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 'var(--sp-6)' }}>
          {start}{end ? ` – ${end}` : ''}
        </div>
      )}

      {gpa && (
        <div className="detail-section">
          <div className="detail-section__heading">GPA</div>
          <div className="detail-section__body">{gpa}</div>
        </div>
      )}
    </div>
  )
}
