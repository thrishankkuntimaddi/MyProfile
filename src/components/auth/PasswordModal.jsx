import { useState } from 'react'
import { X, Lock, KeyRound, Trash2, ChevronRight, Eye, EyeOff } from 'lucide-react'

// ── Password input with show/hide toggle ─────────────────────────────────────
function PwdInput({ value, onChange, placeholder, autoFocus }) {
  const [show, setShow] = useState(false)
  return (
    <div className="pwd-input-wrap">
      <input
        type={show ? 'text' : 'password'}
        className="edit-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Password'}
        autoFocus={autoFocus}
        autoComplete="off"
      />
      <button
        className="pwd-toggle"
        type="button"
        onClick={() => setShow((s) => !s)}
        tabIndex={-1}
      >
        {show ? <EyeOff size={13} /> : <Eye size={13} />}
      </button>
    </div>
  )
}

// ── Strength indicator ────────────────────────────────────────────────────────
function strength(pwd) {
  if (!pwd) return 0
  let s = 0
  if (pwd.length >= 8)  s++
  if (/[A-Z]/.test(pwd)) s++
  if (/[0-9]/.test(pwd)) s++
  if (/[^A-Za-z0-9]/.test(pwd)) s++
  return s // 0-4
}

function StrengthBar({ password }) {
  const s = strength(password)
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', '#e05252', '#d4884a', '#b8956a', '#5aba8a']
  if (!password) return null
  return (
    <div className="strength-bar-wrap">
      <div className="strength-bar-track">
        {[1,2,3,4].map((n) => (
          <div
            key={n}
            className="strength-bar-seg"
            style={{ background: n <= s ? colors[s] : 'var(--border-default)' }}
          />
        ))}
      </div>
      <span className="strength-label" style={{ color: colors[s] }}>{labels[s]}</span>
    </div>
  )
}

// ── Modes ─────────────────────────────────────────────────────────────────────
// 'menu'   – has password, manage options
// 'set'    – no password, create one
// 'change' – enter old + new password
// 'remove' – confirm remove with old password

export function PasswordModal({ hasPassword, onSetPassword, onChangePassword, onRemovePassword, onLockNow, onClose }) {
  const [mode, setMode]       = useState(hasPassword ? 'menu' : 'set')
  const [oldPwd, setOldPwd]   = useState('')
  const [newPwd, setNewPwd]   = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  function reset() {
    setOldPwd(''); setNewPwd(''); setConfirm(''); setError(''); setSuccess('')
  }

  function go(m) { reset(); setMode(m) }

  // ── Actions ────────────────────────────────────────────────────────────────

  function handleSet() {
    if (newPwd.length < 4) return setError('Password must be at least 4 characters.')
    if (newPwd !== confirm) return setError('Passwords do not match.')
    onSetPassword(newPwd)
    setSuccess('Password set. Profile is now protected.')
    reset()
    setTimeout(onClose, 1200)
  }

  function handleChange() {
    if (!oldPwd) return setError('Enter your current password.')
    if (newPwd.length < 4) return setError('New password must be at least 4 characters.')
    if (newPwd !== confirm) return setError('New passwords do not match.')
    const ok = onChangePassword(oldPwd, newPwd)
    if (!ok) return setError('Current password is incorrect.')
    setSuccess('Password updated.')
    reset()
    setTimeout(onClose, 1200)
  }

  function handleRemove() {
    if (!oldPwd) return setError('Enter your current password to confirm.')
    const ok = onRemovePassword(oldPwd)
    if (!ok) return setError('Incorrect password.')
    setSuccess('Password removed. Profile is now open.')
    reset()
    setTimeout(onClose, 1200)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  function renderContent() {
    if (success) {
      return (
        <div className="pwd-success">
          <div className="pwd-success__icon">✓</div>
          <div>{success}</div>
        </div>
      )
    }

    switch (mode) {

      // ── Menu: has password ──────────────────────────────────────────────
      case 'menu':
        return (
          <div className="pwd-menu">
            <button className="pwd-menu-item pwd-menu-item--accent" onClick={() => { onLockNow(); onClose() }}>
              <Lock size={14} />
              <span>Lock Profile Now</span>
              <ChevronRight size={13} className="pwd-menu-item__chevron" />
            </button>

            <div className="pwd-menu-divider" />

            <button className="pwd-menu-item" onClick={() => go('change')}>
              <KeyRound size={14} />
              <span>Change Password</span>
              <ChevronRight size={13} className="pwd-menu-item__chevron" />
            </button>

            <button className="pwd-menu-item pwd-menu-item--danger" onClick={() => go('remove')}>
              <Trash2 size={14} />
              <span>Remove Password</span>
              <ChevronRight size={13} className="pwd-menu-item__chevron" />
            </button>
          </div>
        )

      // ── Set: no password ────────────────────────────────────────────────
      case 'set':
        return (
          <>
            <div className="edit-field">
              <label className="edit-field__label">New Password</label>
              <PwdInput value={newPwd} onChange={(v) => { setNewPwd(v); setError('') }} placeholder="Min 4 characters" autoFocus />
              <StrengthBar password={newPwd} />
            </div>
            <div className="edit-field">
              <label className="edit-field__label">Confirm Password</label>
              <PwdInput value={confirm} onChange={(v) => { setConfirm(v); setError('') }} placeholder="Repeat password" />
            </div>
            {error && <div className="pwd-error">{error}</div>}
          </>
        )

      // ── Change ──────────────────────────────────────────────────────────
      case 'change':
        return (
          <>
            <div className="edit-field">
              <label className="edit-field__label">Current Password</label>
              <PwdInput value={oldPwd} onChange={(v) => { setOldPwd(v); setError('') }} placeholder="Enter old password" autoFocus />
            </div>
            <div className="edit-field">
              <label className="edit-field__label">New Password</label>
              <PwdInput value={newPwd} onChange={(v) => { setNewPwd(v); setError('') }} placeholder="Min 4 characters" />
              <StrengthBar password={newPwd} />
            </div>
            <div className="edit-field">
              <label className="edit-field__label">Confirm New Password</label>
              <PwdInput value={confirm} onChange={(v) => { setConfirm(v); setError('') }} placeholder="Repeat new password" />
            </div>
            {error && <div className="pwd-error">{error}</div>}
          </>
        )

      // ── Remove ──────────────────────────────────────────────────────────
      case 'remove':
        return (
          <>
            <p className="pwd-remove-note">
              Enter your current password to remove protection. Your data will remain, just no longer locked.
            </p>
            <div className="edit-field">
              <label className="edit-field__label">Current Password</label>
              <PwdInput value={oldPwd} onChange={(v) => { setOldPwd(v); setError('') }} placeholder="Confirm with password" autoFocus />
            </div>
            {error && <div className="pwd-error">{error}</div>}
          </>
        )

      default: return null
    }
  }

  function renderFooter() {
    if (success || mode === 'menu') return null
    return (
      <div className="edit-modal__footer">
        {mode !== 'set' && (
          <button className="btn-ghost" onClick={() => go('menu')}>← Back</button>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          {mode === 'set'    && <button className="btn-primary" onClick={handleSet}>Set Password</button>}
          {mode === 'change' && <button className="btn-primary" onClick={handleChange}>Update Password</button>}
          {mode === 'remove' && <button className="btn-ghost-danger" onClick={handleRemove}><Trash2 size={13}/> Remove</button>}
        </div>
      </div>
    )
  }

  const titles = {
    menu:   'Lock & Security',
    set:    'Set Password',
    change: 'Change Password',
    remove: 'Remove Password',
  }

  return (
    <div className="edit-overlay" onClick={onClose}>
      <div className="edit-modal share-modal-sized" onClick={(e) => e.stopPropagation()}>

        <div className="edit-modal__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lock size={13} style={{ color: 'var(--accent)' }} />
            <span className="edit-modal__title">{titles[mode]}</span>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={15} /></button>
        </div>

        <div className="edit-modal__body" style={{ gap: 16 }}>
          {renderContent()}
        </div>

        {renderFooter()}
      </div>
    </div>
  )
}
