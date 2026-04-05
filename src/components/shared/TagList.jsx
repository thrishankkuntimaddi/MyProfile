export function TagList({ items = [] }) {
  if (!items.length) return null
  return (
    <div className="tag-grid">
      {items.map((tag, i) => (
        <span key={i} className="tag">{tag}</span>
      ))}
    </div>
  )
}
