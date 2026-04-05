import { ChevronRight } from 'lucide-react'

export function EducationSection({ education = [], onSelect }) {
  return (
    <>
      <div className="section-heading">Education</div>
      {education.length === 0 ? (
        <div className="empty-state">No education added.</div>
      ) : (
        <div className="item-list">
          {education.map((e, i) => (
            <div key={i} className="item-row" onClick={() => onSelect(e)}>
              <div className="item-row__body">
                <div className="item-row__title">{e.institution}</div>
                {(e.degree || e.field) && (
                  <div className="item-row__sub">
                    {[e.degree, e.field].filter(Boolean).join(' · ')}
                  </div>
                )}
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
