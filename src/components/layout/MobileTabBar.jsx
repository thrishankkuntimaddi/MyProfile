import { Home, Share2, Lock, LockOpen, RotateCcw } from 'lucide-react'

export function MobileTabBar({ view, hasPassword, onHome, onShare, onLock, onReset }) {
  const isHome = view.level === 0

  return (
    <nav className="mobile-tab-bar">

      {/* Home */}
      <button
        className={`tab-btn ${isHome ? 'tab-btn--active' : ''}`}
        onClick={onHome}
      >
        <Home size={18} />
        <span>Home</span>
      </button>

      {/* Share */}
      <button className="tab-btn" onClick={onShare}>
        <Share2 size={18} />
        <span>Share</span>
      </button>

      {/* Lock / Security */}
      <button
        className="tab-btn"
        onClick={onLock}
        style={{ color: hasPassword ? 'var(--accent)' : undefined }}
      >
        {hasPassword ? <Lock size={18} /> : <LockOpen size={18} />}
        <span>{hasPassword ? 'Lock' : 'Security'}</span>
      </button>

      {/* Reset */}
      <button className="tab-btn tab-btn--muted" onClick={onReset}>
        <RotateCcw size={18} />
        <span>Reset</span>
      </button>

    </nav>
  )
}
