import { useState } from 'react'
import { X, Trash2 } from 'lucide-react'

// ── Generic field components ──────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div className="edit-field">
      <label className="edit-field__label">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      className="edit-input"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}

function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      className="edit-textarea"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
    />
  )
}

// ── Section-specific forms ────────────────────────────────────────────────────

function ProfileForm({ data, onChange }) {
  const f = (key, val) => onChange({ ...data, [key]: val })
  return (
    <>
      <Field label="Name"><Input value={data.name} onChange={(v) => f('name', v)} placeholder="Your full name" /></Field>
      <Field label="Title"><Input value={data.title} onChange={(v) => f('title', v)} placeholder="e.g. Backend Engineer" /></Field>
      <Field label="Location"><Input value={data.location} onChange={(v) => f('location', v)} placeholder="e.g. Bengaluru, Karnataka" /></Field>
      <Field label="Email"><Input value={data.email} onChange={(v) => f('email', v)} placeholder="you@email.com" type="email" /></Field>
      <Field label="Summary"><Textarea value={data.summary} onChange={(v) => f('summary', v)} placeholder="Write a short bio…" rows={5} /></Field>
    </>
  )
}

function ExperienceForm({ data, onChange }) {
  const f = (key, val) => onChange({ ...data, [key]: val })
  return (
    <>
      <Field label="Company"><Input value={data.company} onChange={(v) => f('company', v)} placeholder="Company name" /></Field>
      <Field label="Role"><Input value={data.role} onChange={(v) => f('role', v)} placeholder="e.g. Backend Engineer" /></Field>
      <Field label="Start"><Input value={data.start} onChange={(v) => f('start', v)} placeholder="e.g. Jun 2023" /></Field>
      <Field label="End"><Input value={data.end} onChange={(v) => f('end', v)} placeholder="e.g. Present" /></Field>
      <Field label="Location"><Input value={data.location} onChange={(v) => f('location', v)} placeholder="e.g. Remote" /></Field>
      <Field label="Description"><Textarea value={data.description} onChange={(v) => f('description', v)} placeholder="Key responsibilities and achievements…" rows={5} /></Field>
    </>
  )
}

function EducationForm({ data, onChange }) {
  const f = (key, val) => onChange({ ...data, [key]: val })
  return (
    <>
      <Field label="Institution"><Input value={data.institution} onChange={(v) => f('institution', v)} placeholder="University name" /></Field>
      <Field label="Degree"><Input value={data.degree} onChange={(v) => f('degree', v)} placeholder="e.g. B.Tech" /></Field>
      <Field label="Field of Study"><Input value={data.field} onChange={(v) => f('field', v)} placeholder="e.g. Computer Science" /></Field>
      <Field label="Start"><Input value={data.start} onChange={(v) => f('start', v)} placeholder="e.g. 2021" /></Field>
      <Field label="End"><Input value={data.end} onChange={(v) => f('end', v)} placeholder="e.g. 2025" /></Field>
      <Field label="GPA / Grade"><Input value={data.gpa} onChange={(v) => f('gpa', v)} placeholder="e.g. 8.41/10" /></Field>
    </>
  )
}

function ProjectForm({ data, onChange }) {
  const f = (key, val) => onChange({ ...data, [key]: val })
  return (
    <>
      <Field label="Project Name"><Input value={data.name} onChange={(v) => f('name', v)} placeholder="Project title" /></Field>
      <Field label="Description"><Textarea value={data.description} onChange={(v) => f('description', v)} placeholder="What does this project do?" rows={4} /></Field>
      <Field label="Tech Stack (comma-separated)">
        <Input
          value={Array.isArray(data.tech) ? data.tech.join(', ') : data.tech}
          onChange={(v) => f('tech', v.split(',').map((s) => s.trim()).filter(Boolean))}
          placeholder="e.g. Node.js, MongoDB, Redis"
        />
      </Field>
      <Field label="GitHub URL"><Input value={data.github} onChange={(v) => f('github', v)} placeholder="https://github.com/..." /></Field>
      <Field label="Live URL"><Input value={data.url} onChange={(v) => f('url', v)} placeholder="https://..." /></Field>
      <Field label="YouTube URL"><Input value={data.youtube} onChange={(v) => f('youtube', v)} placeholder="https://youtube.com/..." /></Field>
    </>
  )
}

function LinksForm({ data, onChange }) {
  const platforms = ['linkedin', 'github', 'twitter', 'instagram', 'youtube', 'discord']
  return (
    <>
      {platforms.map((p) => (
        <Field key={p} label={p.charAt(0).toUpperCase() + p.slice(1)}>
          <Input
            value={data[p]}
            onChange={(v) => onChange({ ...data, [p]: v })}
            placeholder={`https://${p}.com/...`}
          />
        </Field>
      ))}
    </>
  )
}

function SkillsForm({ data, onChange }) {
  // data = array of { category, items }
  const groups = Array.isArray(data) ? data : []

  function updateGroup(i, key, val) {
    const next = groups.map((g, idx) => idx === i ? { ...g, [key]: val } : g)
    onChange(next)
  }

  function addGroup() {
    onChange([...groups, { category: '', items: [] }])
  }

  function removeGroup(i) {
    onChange(groups.filter((_, idx) => idx !== i))
  }

  return (
    <div className="skills-edit">
      {groups.map((g, i) => (
        <div key={i} className="skills-edit__group">
          <div className="skills-edit__group-header">
            <input
              className="edit-input"
              value={g.category}
              onChange={(e) => updateGroup(i, 'category', e.target.value)}
              placeholder="Category name (e.g. Languages)"
            />
            <button className="btn-icon-sm" onClick={() => removeGroup(i)} title="Remove category">
              <Trash2 size={12} />
            </button>
          </div>
          <textarea
            className="edit-textarea"
            rows={2}
            value={Array.isArray(g.items) ? g.items.join(', ') : g.items}
            onChange={(e) => updateGroup(i, 'items', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            placeholder="Item 1, Item 2, Item 3"
          />
        </div>
      ))}
      <button className="btn-add-group" onClick={addGroup}>+ Add Category</button>
    </div>
  )
}

// ── Empty defaults ────────────────────────────────────────────────────────────

const EMPTY = {
  profile:    { name: '', title: '', location: '', email: '', summary: '' },
  experience: { company: '', role: '', start: '', end: '', location: '', description: '' },
  education:  { institution: '', degree: '', field: '', start: '', end: '', gpa: '' },
  projects:   { name: '', description: '', tech: [], url: '', github: '', youtube: '' },
  links:      { linkedin: '', github: '', twitter: '', instagram: '', youtube: '', discord: '' },
  skills:     [],
}

// ── Main EditModal component ──────────────────────────────────────────────────

const TITLES = {
  profile:    'Edit Profile',
  experience: 'Experience',
  education:  'Education',
  projects:   'Project',
  links:      'Links',
  skills:     'Skills',
}

export function EditModal({ editState, onSave, onDelete, onClose }) {
  const { section, index, data: initialData } = editState
  const isNew = index === null

  const [data, setData] = useState(
    initialData ?? EMPTY[section] ?? {}
  )

  function handleSave() {
    if (!data) return
    onSave(data)
  }

  function renderForm() {
    switch (section) {
      case 'profile':    return <ProfileForm    data={data} onChange={setData} />
      case 'experience': return <ExperienceForm data={data} onChange={setData} />
      case 'education':  return <EducationForm  data={data} onChange={setData} />
      case 'projects':   return <ProjectForm    data={data} onChange={setData} />
      case 'links':      return <LinksForm      data={data} onChange={setData} />
      case 'skills':     return <SkillsForm     data={data} onChange={setData} />
      default:           return null
    }
  }

  return (
    <div className="edit-overlay" onClick={onClose}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="edit-modal__header">
          <span className="edit-modal__title">
            {isNew ? `Add ${TITLES[section]}` : TITLES[section]}
          </span>
          <button className="btn-icon" onClick={onClose}><X size={15} /></button>
        </div>

        {/* Scrollable body */}
        <div className="edit-modal__body">
          {renderForm()}
        </div>

        {/* Footer actions */}
        <div className="edit-modal__footer">
          {!isNew && onDelete && (
            <button
              className="btn-ghost-danger"
              onClick={() => { if (window.confirm('Delete this item?')) onDelete() }}
            >
              <Trash2 size={13} /> Delete
            </button>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}
