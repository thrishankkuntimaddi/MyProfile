import { ChevronRight } from 'lucide-react'

export function ProjectsSection({ projects = [], onSelect }) {
  return (
    <>
      <div className="section-heading">Projects</div>
      {projects.length === 0 ? (
        <div className="empty-state">No projects added.</div>
      ) : (
        <div className="item-list">
          {projects.map((p, i) => (
            <div key={i} className="item-row" onClick={() => onSelect(p)}>
              <div className="item-row__body">
                <div className="item-row__title">{p.name}</div>
                {p.tech?.length > 0 && (
                  <div className="item-row__sub">{p.tech.join(' · ')}</div>
                )}
              </div>
              <ChevronRight size={13} className="item-row__arrow" />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
