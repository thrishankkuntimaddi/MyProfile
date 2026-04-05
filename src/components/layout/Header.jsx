import { RotateCcw, Lock } from 'lucide-react'

const SECTION_LABELS = {
  experience: 'Experience',
  projects:   'Projects',
  skills:     'Skills',
  education:  'Education',
  links:      'Links',
  overview:   'Profile',
}

export function Header({ view, onBack, onHome, onReset, onLock }) {
  const atHome    = view.level === 0
  const atSection = view.level === 1
  const atDetail  = view.level === 2

  const sectionLabel = view.section ? SECTION_LABELS[view.section] || view.section : ''
  const itemLabel    = view.item
    ? (view.item.company || view.item.name || view.item.institution || '')
    : ''

  return (
    <header className="app-header">
      {/* Left: breadcrumb */}
      <nav className="header-breadcrumb">
        {atHome ? (
          <span className="header-brand">MyProfile</span>
        ) : (
          <>
            <button
              className="header-breadcrumb__back header-brand"
              onClick={onHome}
            >
              MyProfile
            </button>
            {sectionLabel && (
              <>
                <span className="header-breadcrumb__sep">/</span>
                {atSection ? (
                  <span className="header-breadcrumb__active">{sectionLabel}</span>
                ) : (
                  <button
                    className="header-breadcrumb__back header-breadcrumb__active"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', color: 'var(--text-muted)', fontSize: 13 }}
                    onClick={onBack}
                  >
                    {sectionLabel}
                  </button>
                )}
              </>
            )}
            {atDetail && itemLabel && (
              <>
                <span className="header-breadcrumb__sep">/</span>
                <span className="header-breadcrumb__active" style={{
                  maxWidth: 200,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                }}>
                  {itemLabel}
                </span>
              </>
            )}
          </>
        )}
      </nav>

      {/* Right: actions */}
      <div className="header-actions">
        {!atHome && (
          <button className="btn-icon" onClick={onBack} title="Back">
            ←
          </button>
        )}
        {onLock && (
          <button className="btn-icon" onClick={onLock} title="Lock">
            <Lock size={13} />
          </button>
        )}
        <button className="btn-icon" onClick={onReset} title="Reset data">
          <RotateCcw size={13} />
        </button>
      </div>
    </header>
  )
}
