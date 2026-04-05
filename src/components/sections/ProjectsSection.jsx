import { SectionLabel } from '../shared/SectionLabel'
import { EmptyState } from '../shared/EmptyState'
import { TagList } from '../shared/TagList'

export function ProjectsSection({ projects = [], onSelect }) {
  if (!projects.length) {
    return (
      <div className="section-inner anim-expand">
        <SectionLabel>Projects</SectionLabel>
        <EmptyState message="No projects found" />
      </div>
    )
  }

  return (
    <div className="section-inner anim-expand">
      <SectionLabel>Projects</SectionLabel>
      <div>
        {projects.map((project, i) => (
          <div key={i} className="timeline-item" onClick={() => onSelect(project)}>
            <div className="timeline-item__header">
              <div>
                <div className="timeline-item__title">{project.name || 'Unnamed Project'}</div>
                {project.description && (
                  <div className="timeline-item__subtitle">{project.description.slice(0, 80)}{project.description.length > 80 ? '…' : ''}</div>
                )}
              </div>
            </div>
            {project.tech?.length > 0 && (
              <div style={{ marginTop: 'var(--sp-2)' }}>
                <TagList items={project.tech.slice(0, 5)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
