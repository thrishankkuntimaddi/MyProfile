import { DashCard } from './DashCard'

function Monogram({ name }) {
  const initials = name
    ? name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '?'
  return (
    <div style={{
      width: 36, height: 36, flexShrink: 0,
      background: 'var(--bg-active)',
      border: '1px solid var(--border-default)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
      letterSpacing: '0.04em',
    }}>
      {initials}
    </div>
  )
}

export function ProfileCard({ profile, onClick }) {
  const { name, title, summary, location } = profile?.profile || {}
  return (
    <DashCard label="Profile" onClick={onClick}>
      {name ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-2)' }}>
            <Monogram name={name} />
            <div>
              <div className="dash-card__title">{name}</div>
              {title && <div className="dash-card__preview-line" style={{ marginTop: 2 }}>{title}</div>}
            </div>
          </div>
          {location && (
            <div className="dash-card__preview-line" style={{ color: 'var(--text-muted)', fontSize: 11 }}>
              {location}
            </div>
          )}
          {summary && (
            <div className="dash-card__preview-line" style={{ marginTop: 4, lineHeight: 1.55 }}>
              {summary.slice(0, 120)}{summary.length > 120 ? '…' : ''}
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
          <div key={i} style={{ paddingBottom: i < experience.slice(0,3).length - 1 ? 'var(--sp-2)' : 0 }}>
            <div className="dash-card__preview-line" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
              {e.company}
            </div>
            {e.role && (
              <div className="dash-card__preview-line" style={{ fontSize: 11, marginTop: 1 }}>{e.role}</div>
            )}
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
          <div key={i} style={{ paddingBottom: i < education.slice(0,3).length - 1 ? 'var(--sp-2)' : 0 }}>
            <div className="dash-card__preview-line" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
              {e.institution}
            </div>
            {(e.degree || e.field) && (
              <div className="dash-card__preview-line" style={{ fontSize: 11, marginTop: 1 }}>
                {[e.degree, e.field].filter(Boolean).join(' · ')}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="dash-card__preview-line" style={{ color: 'var(--text-muted)' }}>No education added</div>
      )}
    </DashCard>
  )
}

export function SkillsCard({ skills = [], onClick }) {
  const allItems = skills.flatMap((s) => s.items)
  return (
    <DashCard label="Skills" count={allItems.length} onClick={onClick}>
      {allItems.length > 0 ? (
        <>
          {skills.slice(0, 3).map((group, i) => (
            <div key={i} style={{ marginBottom: 'var(--sp-2)' }}>
              {group.category && (
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  {group.category}
                </div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {group.items.slice(0, 4).map((item, j) => (
                  <span key={j} className="tag" style={{ fontSize: 11 }}>{item}</span>
                ))}
                {group.items.length > 4 && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', padding: '3px 0' }}>+{group.items.length - 4}</span>
                )}
              </div>
            </div>
          ))}
        </>
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
        projects.slice(0, 4).map((p, i) => (
          <div key={i} className="dash-card__preview-line" style={{
            fontWeight: i === 0 ? 500 : 400,
            color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
          }}>
            {p.name}
          </div>
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
          <div key={key} className="dash-card__preview-line" style={{ textTransform: 'capitalize', fontWeight: 500 }}>
            {key}
          </div>
        ))
      ) : (
        <div className="dash-card__preview-line" style={{ color: 'var(--text-muted)' }}>No links added</div>
      )}
    </DashCard>
  )
}
