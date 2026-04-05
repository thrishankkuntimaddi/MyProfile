import { DashCard } from './DashCard'
import { EmptyState } from '../shared/EmptyState'

export function ProfileCard({ profile, onClick }) {
  const { name, title, summary, location } = profile?.profile || {}
  return (
    <DashCard label="Profile" onClick={onClick}>
      {name ? (
        <>
          <div className="dash-card__title">{name}</div>
          {title && <div className="dash-card__preview-line">{title}</div>}
          {location && <div className="dash-card__preview-line" style={{ color: 'var(--text-muted)' }}>{location}</div>}
          {summary && (
            <div className="dash-card__preview-line" style={{ marginTop: 4 }}>
              {summary.slice(0, 100)}{summary.length > 100 ? '…' : ''}
            </div>
          )}
        </>
      ) : (
        <div className="dash-card__preview-line" style={{ color: 'var(--text-muted)' }}>No profile data</div>
      )}
    </DashCard>
  )
}

export function ExperienceCard({ experience = [], onClick }) {
  return (
    <DashCard label="Experience" count={experience.length} onClick={onClick}>
      {experience.length > 0 ? (
        experience.slice(0, 3).map((e, i) => (
          <div key={i} className="dash-card__preview-line">
            {e.company}{e.role ? ` · ${e.role}` : ''}
          </div>
        ))
      ) : (
        <div className="dash-card__preview-line" style={{ color: 'var(--text-muted)' }}>No experience added</div>
      )}
    </DashCard>
  )
}

export function EducationCard({ education = [], onClick }) {
  return (
    <DashCard label="Education" count={education.length} onClick={onClick}>
      {education.length > 0 ? (
        education.slice(0, 3).map((e, i) => (
          <div key={i} className="dash-card__preview-line">
            {e.institution}{e.degree ? ` · ${e.degree}` : ''}
          </div>
        ))
      ) : (
        <div className="dash-card__preview-line" style={{ color: 'var(--text-muted)' }}>No education added</div>
      )}
    </DashCard>
  )
}

export function SkillsCard({ skills = [], onClick }) {
  const all = skills.flatMap((s) => s.items).slice(0, 8)
  return (
    <DashCard label="Skills" count={skills.flatMap((s) => s.items).length} onClick={onClick}>
      {all.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {all.map((s, i) => (
            <span key={i} className="tag" style={{ fontSize: 11 }}>{s}</span>
          ))}
        </div>
      ) : (
        <div className="dash-card__preview-line" style={{ color: 'var(--text-muted)' }}>No skills added</div>
      )}
    </DashCard>
  )
}

export function ProjectsCard({ projects = [], onClick }) {
  return (
    <DashCard label="Projects" count={projects.length} onClick={onClick}>
      {projects.length > 0 ? (
        projects.slice(0, 3).map((p, i) => (
          <div key={i} className="dash-card__preview-line">{p.name}</div>
        ))
      ) : (
        <div className="dash-card__preview-line" style={{ color: 'var(--text-muted)' }}>No projects added</div>
      )}
    </DashCard>
  )
}

export function LinksCard({ links = {}, onClick }) {
  const active = Object.entries(links).filter(([, v]) => v)
  return (
    <DashCard label="Links" count={active.length} onClick={onClick}>
      {active.length > 0 ? (
        active.slice(0, 4).map(([key]) => (
          <div key={key} className="dash-card__preview-line" style={{ textTransform: 'capitalize' }}>{key}</div>
        ))
      ) : (
        <div className="dash-card__preview-line" style={{ color: 'var(--text-muted)' }}>No links added</div>
      )}
    </DashCard>
  )
}
