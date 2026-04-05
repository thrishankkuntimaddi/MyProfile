import { useState } from 'react'
import { X, Lock, KeyRound, Trash2, ChevronRight, Eye, EyeOff, AlertTriangle } from 'lucide-react'

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
      <button className="pwd-toggle" type="button" onClick={() => setShow(s => !s)} tabIndex={-1}>
        {show ? <EyeOff size={13} /> : <Eye size={13} />}
      </button>
    </div>
  )
}

function strength(pwd) {
  if (!pwd) return 0
  let s = 0
  if (pwd.length >= 8)        s++
  if (/[A-Z]/.test(pwd))      s++
  if (/[0-9]/.test(pwd))      s++
  if (/[^A-Za-z0-9]/.test(pwd)) s++
  return s
}

function StrengthBar({ password }) {
  const s = strength(password)
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', '#e05252', '#d4884a', '#b8956a', '#5aba8a']
  if (!password) return null
  return (
    <div className="strength-bar-wrap">
      <div className="strength-bar-track">
        {[1,2,3,4].map(n => (
          <div key={n} className="strength-bar-seg"
            style={{ background: n <= s ? colors[s] : 'var(--border-default)' }} />
        ))}
      </div>
      <span className="strength-label" style={{ color: colors[s] }}>{labels[s]}</span>
    </div>
  )
}

// modes: 'menu' | 'set' | 'change' | 'remove' | 'reset-confirm'
export function PasswordModal({ hasPassword, onSetPassword, onChangePassword, onRemovePassword, onLockNow, onResetAll, onClose, inline }) {

  // Always open to menu — menu handles both has-password and no-password states
  const [mode,    setMode]    = useState('menu')
  const [oldPwd,  setOldPwd]  = useState('')
  const [newPwd,  setNewPwd]  = useState('')
  const [confirm, setConfirm] = useState('')
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')

  function clear() { setOldPwd(''); setNewPwd(''); setConfirm(''); setError('') }
  function go(m)   { clear(); setSuccess(''); setMode(m) }

  function handleSet() {
    if (newPwd.length < 4)   return setError('Password must be at least 4 characters.')
    if (newPwd !== confirm)  return setError('Passwords do not match.')
    onSetPassword(newPwd)
    setSuccess('Password set. Profile is now protected.')
    setTimeout(onClose, 1200)
  }

  function handleChange() {
    if (!oldPwd)             return setError('Enter your current password.')
    if (newPwd.length < 4)   return setError('New password must be at least 4 characters.')
    if (newPwd !== confirm)  return setError('New passwords do not match.')
    const ok = onChangePassword(oldPwd, newPwd)
    if (!ok)                 return setError('Current password is incorrect.')
    setSuccess('Password updated successfully.')
    setTimeout(onClose, 1200)
  }

  function handleRemove() {
    if (!oldPwd) return setError('Enter your current password to confirm.')
    const ok = onRemovePassword(oldPwd)
    if (!ok)     return setError('Incorrect password.')
    setSuccess('Password removed. Profile is now open.')
    setTimeout(onClose, 1200)
  }

  function handleReset() {
    onResetAll()
    onClose()
  }

  // ── Render content ──────────────────────────────────────────────────────────

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

      case 'menu':
        return (
          <div className="pwd-menu">

            {/* --- Security section --- */}
            <div className="pwd-menu-section-label">Security</div>

            {hasPassword && (
              <button className="pwd-menu-item pwd-menu-item--accent" onClick={() => { onLockNow(); onClose() }}>
                <Lock size={15} />
                <span>Lock Profile Now</span>
                <ChevronRight size={13} className="pwd-menu-item__chevron" />
              </button>
            )}

            {hasPassword ? (
              <button className="pwd-menu-item" onClick={() => go('change')}>
                <KeyRound size={15} />
                <span>Change Password</span>
                <ChevronRight size={13} className="pwd-menu-item__chevron" />
              </button>
            ) : (
              <button className="pwd-menu-item" onClick={() => go('set')}>
                <Lock size={15} />
                <span>Set Password</span>
                <ChevronRight size={13} className="pwd-menu-item__chevron" />
              </button>
            )}

            {hasPassword && (
              <button className="pwd-menu-item pwd-menu-item--danger" onClick={() => go('remove')}>
                <KeyRound size={15} />
                <span>Remove Password</span>
                <ChevronRight size={13} className="pwd-menu-item__chevron" />
              </button>
            )}

            {/* --- Danger zone --- */}
            <div className="pwd-menu-divider" style={{ marginTop: 12 }} />
            <div className="pwd-menu-section-label" style={{ color: '#b05252' }}>Danger Zone</div>

            <button className="pwd-menu-item pwd-menu-item--danger" onClick={() => go('reset-confirm')}>
              <Trash2 size={15} />
              <span>Reset All Data</span>
              <ChevronRight size={13} className="pwd-menu-item__chevron" />
            </button>
          </div>
        )

      case 'set':
        return (
          <>
            <div className="edit-field">
              <label className="edit-field__label">New Password</label>
              <PwdInput value={newPwd} onChange={v => { setNewPwd(v); setError('') }} placeholder="Min 4 characters" autoFocus />
              <StrengthBar password={newPwd} />
            </div>
            <div className="edit-field">
              <label className="edit-field__label">Confirm Password</label>
              <PwdInput value={confirm} onChange={v => { setConfirm(v); setError('') }} placeholder="Repeat password" />
            </div>
            {error && <div className="pwd-error">{error}</div>}
          </>
        )

      case 'change':
        return (
          <>
            <div className="edit-field">
              <label className="edit-field__label">Current Password</label>
              <PwdInput value={oldPwd} onChange={v => { setOldPwd(v); setError('') }} placeholder="Enter current password" autoFocus />
            </div>
            <div className="edit-field">
              <label className="edit-field__label">New Password</label>
              <PwdInput value={newPwd} onChange={v => { setNewPwd(v); setError('') }} placeholder="Min 4 characters" />
              <StrengthBar password={newPwd} />
            </div>
            <div className="edit-field">
              <label className="edit-field__label">Confirm New Password</label>
              <PwdInput value={confirm} onChange={v => { setConfirm(v); setError('') }} placeholder="Repeat new password" />
            </div>
            {error && <div className="pwd-error">{error}</div>}
          </>
        )

      case 'remove':
        return (
          <>
            <p className="pwd-remove-note">
              Enter your current password to remove protection. Your data stays, just unlocked.
            </p>
            <div className="edit-field">
              <label className="edit-field__label">Current Password</label>
              <PwdInput value={oldPwd} onChange={v => { setOldPwd(v); setError('') }} placeholder="Confirm with password" autoFocus />
            </div>
            {error && <div className="pwd-error">{error}</div>}
          </>
        )

      case 'reset-confirm':
        return (
          <div className="pwd-reset-confirm">
            <div className="pwd-reset-icon"><AlertTriangle size={22} /></div>
            <div className="pwd-reset-title">Reset All Data?</div>
            <p className="pwd-reset-desc">
              This will permanently delete your profile, all sections, and your password.
              This cannot be undone.
            </p>
          </div>
        )

      default: return null
    }
  }

  function renderFooter() {
    if (success || mode === 'menu') return null
    return (
      <div className="edit-modal__footer">
        <button className="btn-ghost" onClick={() => go('menu')}>← Back</button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          {mode === 'set'           && <button className="btn-primary"     onClick={handleSet}>Set Password</button>}
          {mode === 'change'        && <button className="btn-primary"     onClick={handleChange}>Update</button>}
          {mode === 'remove'        && <button className="btn-ghost-danger" onClick={handleRemove}><Trash2 size={12}/> Remove</button>}
          {mode === 'reset-confirm' && <button className="btn-ghost-danger" onClick={handleReset}><AlertTriangle size={12}/> Yes, Reset Everything</button>}
        </div>
      </div>
    )
  }

  const titles = {
    menu:          'Settings',
    set:           'Set Password',
    change:        'Change Password',
    remove:        'Remove Password',
    'reset-confirm': 'Confirm Reset',
  }

  const inner = (
    <div className="edit-modal share-modal-sized">
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
  )

  if (inline) return inner

  return (
    <div className="edit-overlay" onClick={onClose}>
      {inner}
    </div>
  )
}
