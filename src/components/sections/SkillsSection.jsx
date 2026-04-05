export function SkillsSection({ skills = [] }) {
  return (
    <>
      <div className="section-heading">Skills</div>
      {skills.length === 0 ? (
        <div className="empty-state">No skills added.</div>
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
