import { useState } from 'react'

export function LockScreen({ onUnlock, onReset, attemptsLeft }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleUnlock() {
    const success = onUnlock(password)
    if (!success) {
      setError(
        attemptsLeft <= 1
          ? 'Last attempt — all data will be cleared on next failure.'
          : `Incorrect password. ${attemptsLeft - 1} attempt${attemptsLeft - 1 === 1 ? '' : 's'} remaining.`
      )
      setPassword('')
    }
  }

  return (
    <div className="fullscreen-center">
      <div className="lock-box anim-fade">
        <div className="lock-title">MyProfile</div>
        <div className="lock-sub">Enter your password to continue.</div>

        <input
          type="password"
          className="lock-input"
          placeholder="Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError('') }}
          onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
          autoFocus
        />

        {error && <div className="lock-error">{error}</div>}

        <button className="btn-primary" style={{ width: '100%' }} onClick={handleUnlock}>
          Unlock
        </button>

        <button className="lock-reset" onClick={onReset}>
          Forgot password? Reset all data →
        </button>
      </div>
    </div>
  )
}
