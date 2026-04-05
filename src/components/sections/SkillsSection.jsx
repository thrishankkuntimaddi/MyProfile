import { Pencil } from 'lucide-react'

export function SkillsSection({ skills = [], onEdit }) {
  return (
    <>
      <div className="section-heading-row">
        <div className="section-heading">Skills</div>
        <button className="btn-add" onClick={onEdit} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Pencil size={12} /> Edit
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="empty-state">No skills added. <button className="link-btn" onClick={onEdit}>Add skills →</button></div>
      ) : (
        <div className="skills-section-groups">
          {skills.map((group, i) => (
            <div key={i} className="skill-group">
              {group.category && (
                <div className="skill-group__label">{group.category}</div>
              )}
              <div className="skill-group__tags">
                {group.items.map((item, j) => (
                  <span key={j} className="tag">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
