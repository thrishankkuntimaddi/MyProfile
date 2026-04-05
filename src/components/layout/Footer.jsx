export function Footer({ profile }) {
  const name = profile?.profile?.name
  const title = profile?.profile?.title

  return (
    <footer className="app-footer">
      {name && <span className="footer-text">{name}</span>}
      {name && title && <span className="footer-dot">·</span>}
      {title && <span className="footer-text" style={{ color: 'var(--text-muted)' }}>{title}</span>}
      <span style={{ flex: 1 }} />
      <span className="footer-text">localStorage</span>
    </footer>
  )
}
