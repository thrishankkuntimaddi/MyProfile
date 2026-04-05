import { SectionLabel } from '../shared/SectionLabel'
import { TagList } from '../shared/TagList'
import { EmptyState } from '../shared/EmptyState'

export function SkillsSection({ skills = [] }) {
  if (!skills.length) {
    return (
      <div className="section-inner anim-expand">
        <SectionLabel>Skills</SectionLabel>
        <EmptyState message="No skills found" />
      </div>
    )
  }

  return (
    <div className="section-inner anim-expand">
      <SectionLabel>Skills</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
        {skills.map((group, i) => (
          <div key={i}>
            {group.category && (
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 'var(--sp-3)'
              }}>
                {group.category}
              </div>
            )}
            <TagList items={group.items} />
          </div>
        ))}
      </div>
    </div>
  )
}
