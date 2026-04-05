import { ChevronRight, Plus, Pencil, Trash2 } from 'lucide-react'

export function ProjectsSection({ projects = [], onSelect, onAdd, onEdit, onDelete }) {
  return (
    <>
      <div className="section-heading-row">
        <div className="section-heading">Projects</div>
        <button className="btn-add" onClick={onAdd}><Plus size={13} /> Add</button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">No projects added. <button className="link-btn" onClick={onAdd}>Add one →</button></div>
      ) : (
        <div className="item-list">
          {projects.map((p, i) => (
            <div key={i} className="item-row">
              <div className="item-row__body" onClick={() => onSelect(p)}>
                <div className="item-row__title">{p.name}</div>
                {p.tech?.length > 0 && (
                  <div className="item-row__sub">{p.tech.join(' · ')}</div>
                )}
              </div>
              <div className="item-row__actions">
                <button className="row-action-btn" onClick={() => onEdit(i, p)}><Pencil size={12} /></button>
                <button className="row-action-btn row-action-btn--danger" onClick={() => onDelete(i)}><Trash2 size={12} /></button>
              </div>
              <ChevronRight size={13} className="item-row__arrow" onClick={() => onSelect(p)} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
