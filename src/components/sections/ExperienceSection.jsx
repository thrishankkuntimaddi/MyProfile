import { ChevronRight } from 'lucide-react'

export function ExperienceSection({ experience = [], onSelect }) {
  return (
    <>
      <div className="section-heading">Experience</div>
      {experience.length === 0 ? (
        <div className="empty-state">No experience added.</div>
      ) : (
        <div className="item-list">
          {experience.map((e, i) => (
            <div key={i} className="item-row" onClick={() => onSelect(e)}>
              <div className="item-row__body">
                <div className="item-row__title">{e.company}</div>
                {e.role && <div className="item-row__sub">{e.role}</div>}
              </div>
              {(e.start || e.end) && (
                <div className="item-row__date">
                  {e.start}{e.end ? `–${e.end}` : ''}
                </div>
              )}
              <ChevronRight size={13} className="item-row__arrow" />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
