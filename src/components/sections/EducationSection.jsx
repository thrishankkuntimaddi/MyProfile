import { SectionLabel } from '../shared/SectionLabel'
import { EmptyState } from '../shared/EmptyState'

export function EducationSection({ education = [], onSelect }) {
  if (!education.length) {
    return (
      <div className="section-inner anim-expand">
        <SectionLabel>Education</SectionLabel>
        <EmptyState message="No education entries found" />
      </div>
    )
  }

  return (
    <div className="section-inner anim-expand">
      <SectionLabel>Education</SectionLabel>
      <div>
        {education.map((item, i) => (
          <div key={i} className="timeline-item" onClick={() => onSelect(item)}>
            <div className="timeline-item__header">
              <div>
                <div className="timeline-item__title">{item.institution || 'Unknown Institution'}</div>
                <div className="timeline-item__subtitle">
                  {[item.degree, item.field].filter(Boolean).join(' · ')}
                </div>
              </div>
              <div className="timeline-item__date">
                {item.start}{item.end ? ` – ${item.end}` : ''}
              </div>
            </div>
            {item.gpa && (
              <div className="timeline-item__desc">GPA: {item.gpa}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
