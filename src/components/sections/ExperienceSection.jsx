import { ChevronRight, Plus, Pencil, Trash2 } from 'lucide-react'

export function ExperienceSection({ experience = [], onSelect, onAdd, onEdit, onDelete }) {
  return (
    <>
      <div className="section-heading-row">
        <div className="section-heading">Experience</div>
        <button className="btn-add" onClick={onAdd}><Plus size={13} /> Add</button>
      </div>

      {experience.length === 0 ? (
        <div className="empty-state">No experience added. <button className="link-btn" onClick={onAdd}>Add one →</button></div>
      ) : (
        <div className="item-list">
          {experience.map((e, i) => (
            <div key={i} className="item-row">
              <div className="item-row__body" onClick={() => onSelect(e)}>
                <div className="item-row__title">{e.company}</div>
                {e.role && <div className="item-row__sub">{e.role}</div>}
              </div>
              {(e.start || e.end) && (
                <div className="item-row__date" onClick={() => onSelect(e)}>
                  {e.start}{e.end ? `–${e.end}` : ''}
                </div>
              )}
              <div className="item-row__actions">
                <button className="row-action-btn" onClick={() => onEdit(i, e)} title="Edit"><Pencil size={12} /></button>
                <button className="row-action-btn row-action-btn--danger" onClick={() => onDelete(i)} title="Delete"><Trash2 size={12} /></button>
              </div>
              <ChevronRight size={13} className="item-row__arrow" onClick={() => onSelect(e)} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
