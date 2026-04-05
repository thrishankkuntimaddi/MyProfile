import { Home, Share2, Settings2 } from 'lucide-react'

export function MobileTabBar({ mobileTab, onHome, onShare, onSettings }) {
  return (
    <nav className="mobile-tab-bar">
      <button
        className={`tab-btn ${mobileTab === 'home' ? 'tab-btn--active' : ''}`}
        onClick={onHome}
      >
        <Home size={20} strokeWidth={1.75} />
        <span>Home</span>
      </button>

      <button
        className={`tab-btn ${mobileTab === 'share' ? 'tab-btn--active' : ''}`}
        onClick={onShare}
      >
        <Share2 size={20} strokeWidth={1.75} />
        <span>Share</span>
      </button>

      <button
        className={`tab-btn ${mobileTab === 'settings' ? 'tab-btn--active' : ''}`}
        onClick={onSettings}
      >
        <Settings2 size={20} strokeWidth={1.75} />
        <span>Settings</span>
      </button>
    </nav>
  )
}
