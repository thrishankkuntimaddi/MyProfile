import { ChevronRight } from 'lucide-react'

const SECTION_META = {
  experience: { label: 'Experience' },
  projects:   { label: 'Projects' },
  skills:     { label: 'Skills' },
  education:  { label: 'Education' },
  links:      { label: 'Links' },
}

export function Overview({ profile, onOpenSection }) {
  const p = profile?.profile || {}
  const initials = p.name
    ? p.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '?'

  const sections = [
    {
      key: 'experience',
      count: profile?.experience?.length ?? 0,
      preview: profile?.experience?.[0]?.company || null,
    },
    {
      key: 'projects',
      count: profile?.projects?.length ?? 0,
      preview: profile?.projects?.[0]?.name || null,
    },
    {
      key: 'skills',
      count: profile?.skills?.flatMap((s) => s.items).length ?? 0,
      preview: profile?.skills?.map((s) => s.category).join(' · ') || null,
    },
    {
      key: 'education',
      count: profile?.education?.length ?? 0,
      preview: profile?.education?.[0]?.institution || null,
    },
    {
      key: 'links',
      count: Object.values(profile?.links || {}).filter(Boolean).length,
      preview: null,
    },
  ]

  return (
    <div className="overview-wrap anim-overview">
      <div className="overview-content">

        {/* Identity block */}
        <div className="identity-block">
          <div className="identity-avatar">{initials}</div>
          <div>
            <h1 className="identity-name">{p.name || 'Your Profile'}</h1>
            {p.title && <div className="identity-role">{p.title}</div>}
            {(p.location || p.email) && (
              <div className="identity-meta">
                {[p.location, p.email].filter(Boolean).join(' · ')}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {p.summary && (
          <p className="identity-summary">{p.summary}</p>
        )}

        {/* Section rows */}
        <div className="section-rows">
          {sections.map((s) => (
            <button
              key={s.key}
              className="section-row"
              onClick={() => onOpenSection(s.key)}
            >
              <div className="section-row__left">
                <span className="section-row__label">
                  {SECTION_META[s.key].label}
                </span>
                {s.preview && (
                  <span className="section-row__preview">{s.preview}</span>
                )}
              </div>
              <div className="section-row__right">
                {s.count > 0 && (
                  <span className="section-row__count">{s.count}</span>
                )}
                <ChevronRight size={14} className="section-row__arrow" />
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
