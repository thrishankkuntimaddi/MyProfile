import { ArrowUpRight } from 'lucide-react'

export function DashCard({ label, children, count, onClick }) {
  return (
    <div className="dash-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}>
      <div className="dash-card__label">{label}</div>
      <div className="dash-card__preview">{children}</div>
      {count !== undefined && (
        <div className="dash-card__count">{count} {count === 1 ? 'item' : 'items'} →</div>
      )}
      <div className="dash-card__arrow"><ArrowUpRight size={14} /></div>
    </div>
  )
}
