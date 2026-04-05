import { Link2, ExternalLink, Pencil } from 'lucide-react'

export function LinksSection({ links = {}, onEdit }) {
  const active = Object.entries(links).filter(([, v]) => v)

  return (
    <>
      <div className="section-heading-row">
        <div className="section-heading">Links</div>
        <button className="btn-add" onClick={onEdit} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Pencil size={12} /> Edit
        </button>
      </div>

      {active.length === 0 ? (
        <div className="empty-state">No links added. <button className="link-btn" onClick={onEdit}>Add links →</button></div>
      ) : (
        <div className="links-list">
          {active.map(([key, url]) => (
            <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="link-row">
              <Link2 size={13} className="link-row__icon" />
              <span className="link-row__name">{key}</span>
              <span className="link-row__url">{url}</span>
              <ExternalLink size={11} className="link-row__ext" />
            </a>
          ))}
        </div>
      )}
    </>
  )
}
