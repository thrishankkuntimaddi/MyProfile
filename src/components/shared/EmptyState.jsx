export function EmptyState({ message = 'No data available' }) {
  return (
    <div className="empty-state">
      <div className="empty-state__text">{message}</div>
    </div>
  )
}
