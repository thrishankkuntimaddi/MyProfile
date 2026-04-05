import { ChevronRight, Plus, Pencil, Trash2 } from 'lucide-react'

export function EducationSection({ education = [], onSelect, onAdd, onEdit, onDelete }) {
  return (
    <>
      <div className="section-heading-row">
        <div className="section-heading">Education</div>
        <button className="btn-add" onClick={onAdd}><Plus size={13} /> Add</button>
      </div>

      {education.length === 0 ? (
        <div className="empty-state">No education added. <button className="link-btn" onClick={onAdd}>Add one →</button></div>
      ) : (
        <div className="item-list">
          {education.map((e, i) => (
            <div key={i} className="item-row">
              <div className="item-row__body" onClick={() => onSelect(e)}>
                <div className="item-row__title">{e.institution}</div>
                {(e.degree || e.field) && (
                  <div className="item-row__sub">{[e.degree, e.field].filter(Boolean).join(' · ')}</div>
                )}
              </div>
              {(e.start || e.end) && (
                <div className="item-row__date" onClick={() => onSelect(e)}>
                  {e.start}{e.end ? `–${e.end}` : ''}
                </div>
              )}
              <div className="item-row__actions">
                <button className="row-action-btn" onClick={() => onEdit(i, e)}><Pencil size={12} /></button>
                <button className="row-action-btn row-action-btn--danger" onClick={() => onDelete(i)}><Trash2 size={12} /></button>
              </div>
              <ChevronRight size={13} className="item-row__arrow" onClick={() => onSelect(e)} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}
