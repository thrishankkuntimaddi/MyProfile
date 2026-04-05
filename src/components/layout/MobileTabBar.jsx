import { Home, Share2, Settings2 } from 'lucide-react'

export function MobileTabBar({ view, onHome, onShare, onSettings }) {
  const isHome = view.level === 0

  return (
    <nav className="mobile-tab-bar">
      <button
        className={`tab-btn ${isHome ? 'tab-btn--active' : ''}`}
        onClick={onHome}
      >
        <Home size={20} strokeWidth={1.75} />
        <span>Home</span>
      </button>

      <button className="tab-btn" onClick={onShare}>
        <Share2 size={20} strokeWidth={1.75} />
        <span>Share</span>
      </button>

      <button className="tab-btn" onClick={onSettings}>
        <Settings2 size={20} strokeWidth={1.75} />
        <span>Settings</span>
      </button>
    </nav>
  )
}
