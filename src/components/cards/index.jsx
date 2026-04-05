import { DashCard } from './DashCard'

function Monogram({ name }) {
  const initials = name
    ? name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '?'
  return (
    <div className="monogram">{initials}</div>
  )
}

// ── Profile ──────────────────────────────────────────────────────────────────
export function ProfileCard({ profile, onClick }) {
  const { name, title, summary, location, email } = profile?.profile || {}
  return (
    <DashCard label="Profile" onClick={onClick}>
      <div className="card-profile-hero">
        <Monogram name={name} />
        <div className="card-profile-info">
          <div className="card-name">{name || 'No name'}</div>
          {title && <div className="card-subtitle">{title}</div>}
        </div>
      </div>
      {location && <div className="card-meta">{location}</div>}
      {email && <div className="card-meta">{email}</div>}
      {summary && (
        <div className="card-summary">{summary}</div>
      )}
    </DashCard>
  )
}

// ── Experience ────────────────────────────────────────────────────────────────
export function ExperienceCard({ experience = [], onClick }) {
  return (
    <DashCard label="Experience" count={experience.length} onClick={onClick}>
      {experience.length > 0 ? (
        <div className="card-list">
          {experience.map((e, i) => (
            <div key={i} className="card-list-item">
              <div className="card-list-item__primary">{e.company}</div>
              {e.role && <div className="card-list-item__secondary">{e.role}</div>}
              {e.start && (
                <div className="card-list-item__meta">
                  {e.start}{e.end ? ` – ${e.end}` : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card-empty">No experience added</div>
      )}
    </DashCard>
  )
}

// ── Education ─────────────────────────────────────────────────────────────────
export function EducationCard({ education = [], onClick }) {
  return (
    <DashCard label="Education" count={education.length} onClick={onClick}>
      {education.length > 0 ? (
        <div className="card-list">
          {education.map((e, i) => (
            <div key={i} className="card-list-item">
              <div className="card-list-item__primary">{e.institution}</div>
              {(e.degree || e.field) && (
                <div className="card-list-item__secondary">
                  {[e.degree, e.field].filter(Boolean).join(' · ')}
                </div>
              )}
              {e.gpa && <div className="card-list-item__meta">GPA {e.gpa}</div>}
              {(e.start || e.end) && (
                <div className="card-list-item__meta">
                  {e.start}{e.end ? ` – ${e.end}` : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card-empty">No education added</div>
      )}
    </DashCard>
  )
}

// ── Skills ────────────────────────────────────────────────────────────────────
export function SkillsCard({ skills = [], onClick }) {
  const allItems = skills.flatMap((s) => s.items)
  return (
    <DashCard label="Skills" count={allItems.length} onClick={onClick}>
      {skills.length > 0 ? (
        <div className="card-skills">
          {skills.map((group, i) => (
            <div key={i} className="card-skill-group">
              {group.category && (
                <div className="card-skill-group__label">{group.category}</div>
              )}
              <div className="card-skill-group__tags">
                {group.items.map((item, j) => (
                  <span key={j} className="tag">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-empty">No skills added</div>
      )}
    </DashCard>
  )
}

// ── Projects ──────────────────────────────────────────────────────────────────
export function ProjectsCard({ projects = [], onClick }) {
  return (
    <DashCard label="Projects" count={projects.length} onClick={onClick}>
      {projects.length > 0 ? (
        <div className="card-list">
          {projects.map((p, i) => (
            <div key={i} className="card-list-item">
              <div className="card-list-item__primary">{p.name}</div>
              {p.tech?.length > 0 && (
                <div className="card-list-item__secondary">
                  {p.tech.slice(0, 3).join(' · ')}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card-empty">No projects added</div>
      )}
    </DashCard>
  )
}

// ── Links ─────────────────────────────────────────────────────────────────────
export function LinksCard({ links = {}, onClick }) {
  const active = Object.entries(links).filter(([, v]) => v)
  return (
    <DashCard label="Links" count={active.length} onClick={onClick}>
      {active.length > 0 ? (
        <div className="card-list">
          {active.map(([key, val]) => (
            <div key={key} className="card-list-item">
              <div className="card-list-item__primary" style={{ textTransform: 'capitalize' }}>{key}</div>
              <div className="card-list-item__secondary">{val}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-empty">No links added</div>
      )}
    </DashCard>
  )
}
