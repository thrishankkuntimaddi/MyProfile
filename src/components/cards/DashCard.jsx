import { ArrowUpRight } from 'lucide-react'

export function DashCard({ label, children, count, onClick }) {
  const countLabel = count !== undefined
    ? `${count} ${count === 1 ? 'item' : 'items'}`
    : null

  return (
    <div
      className="dash-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <div className="dash-card__label">{label}</div>
      <div className="dash-card__body">{children}</div>
      <div className="dash-card__footer">
        {countLabel && <span className="dash-card__count">{countLabel}</span>}
        <ArrowUpRight size={13} className="dash-card__arrow" />
      </div>
    </div>
  )
}
