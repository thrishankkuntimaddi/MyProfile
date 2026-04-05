import { ArrowLeft, X, RotateCcw, Lock } from 'lucide-react'

const SECTION_LABELS = {
  overview: 'Overview',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  links: 'Links',
}

export function Header({ view, onBack, onHome, onReset, onLock }) {
  const { level, section, item } = view

  return (
    <header className="app-header">
      {/* Left: Brand + Breadcrumb */}
      <div className="header-breadcrumb">
        <span className="header-brand">MyProfile</span>

        {level >= 1 && section && (
          <>
            <span className="header-breadcrumb__sep">/</span>
            <button
              className="btn-text"
              style={{ padding: '2px 4px', color: level === 2 ? 'var(--text-secondary)' : 'var(--text-primary)' }}
              onClick={level === 2 ? onBack : undefined}
            >
              {SECTION_LABELS[section] || section}
            </button>
          </>
        )}

        {level === 2 && item !== null && item.name && (
          <>
            <span className="header-breadcrumb__sep">/</span>
            <span className="header-breadcrumb__active">{item.name || item.company || item.institution}</span>
          </>
        )}
      </div>

      {/* Right: Actions */}
      <div className="header-actions">
        {level > 0 ? (
          <>
            <button className="btn-icon" onClick={onBack} title="Go back">
              <ArrowLeft size={15} />
            </button>
            <button className="btn-icon" onClick={onHome} title="Close">
              <X size={15} />
            </button>
          </>
        ) : (
          <>
            <button className="btn-icon" onClick={onLock} title="Lock">
              <Lock size={14} />
            </button>
            <button className="btn-icon" onClick={onReset} title="Reset all data">
              <RotateCcw size={14} />
            </button>
          </>
        )}
      </div>
    </header>
  )
}
