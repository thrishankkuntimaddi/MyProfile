import { RotateCcw, Lock, LockOpen, Share2 } from 'lucide-react'

const SECTION_LABELS = {
  experience: 'Experience',
  projects:   'Projects',
  skills:     'Skills',
  education:  'Education',
  links:      'Links',
  overview:   'Profile',
}

export function Header({ view, hasPassword, onBack, onHome, onReset, onLock, onShare }) {
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
        {/* Back button — shown on all screen sizes when not at home */}
        {!atHome && (
          <button className="btn-icon" onClick={onBack} title="Back">←</button>
        )}
        {/* Share / Lock / Reset — desktop only; tab bar handles mobile */}
        <div className="header-actions-desktop">
          {onShare && (
            <button className="btn-icon" onClick={onShare} title="Share profile">
              <Share2 size={13} />
            </button>
          )}
          {onLock && (
            <button
              className="btn-icon"
              onClick={onLock}
              title={hasPassword ? 'Lock / Manage password' : 'Set password'}
              style={{ color: hasPassword ? 'var(--accent)' : 'var(--text-muted)' }}
            >
              {hasPassword ? <Lock size={13} /> : <LockOpen size={13} />}
            </button>
          )}
          <button className="btn-icon" onClick={onReset} title="Reset data">
            <RotateCcw size={13} />
          </button>
        </div>
      </div>
    </header>
  )
}
