import { SectionLabel } from '../shared/SectionLabel'
import { EmptyState } from '../shared/EmptyState'

export function ExperienceSection({ experience = [], onSelect }) {
  if (!experience.length) {
    return (
      <div className="section-inner anim-expand">
        <SectionLabel>Experience</SectionLabel>
        <EmptyState message="No experience entries found" />
      </div>
    )
  }

  return (
    <div className="section-inner anim-expand">
      <SectionLabel>Experience</SectionLabel>
      <div>
        {experience.map((item, i) => (
          <div key={i} className="timeline-item" onClick={() => onSelect(item)}>
            <div className="timeline-item__header">
              <div>
                <div className="timeline-item__title">{item.company || 'Unknown Company'}</div>
                <div className="timeline-item__subtitle">{item.role || 'Role not specified'}</div>
              </div>
              <div className="timeline-item__date">
                {item.start}{item.end ? ` – ${item.end}` : ''}
              </div>
            </div>
            {item.description && (
              <div className="timeline-item__desc">{item.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
