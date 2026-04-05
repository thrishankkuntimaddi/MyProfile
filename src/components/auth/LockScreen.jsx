import { useState, useRef, useEffect } from 'react'
import { Lock } from 'lucide-react'

export function LockScreen({ onUnlock, onReset, attemptsLeft }) {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [shaking, setShaking]   = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  function handleUnlock() {
    if (!password.trim()) return
    const success = onUnlock(password)
    if (!success) {
      const remaining = attemptsLeft - 1
      setError(
        remaining <= 0
          ? 'Too many attempts — all data has been cleared.'
          : remaining === 1
          ? `Wrong password. 1 attempt remaining — next failure clears all data.`
          : `Wrong password. ${remaining} attempts remaining.`
      )
      setPassword('')
      // Shake animation
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
  }

  return (
    <div className="fullscreen-center">
      <div className={`lock-screen-box anim-fade ${shaking ? 'lock-shake' : ''}`}>

        {/* Icon */}
        <div className="lock-screen-icon">
          <Lock size={22} />
        </div>

        <div className="lock-title">MyProfile</div>
        <div className="lock-sub">Enter your password to continue.</div>

        <input
          ref={inputRef}
          type="password"
          className="lock-input"
          placeholder="Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError('') }}
          onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
          autoComplete="current-password"
        />

        {error && <div className="lock-error">{error}</div>}

        <button
          className="btn-primary"
          style={{ width: '100%', marginTop: 4 }}
          onClick={handleUnlock}
          disabled={!password.trim()}
        >
          Unlock
        </button>

        {/* Attempt dots */}
        {attemptsLeft < 5 && (
          <div className="lock-dots">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`lock-dot ${i < 5 - attemptsLeft ? 'lock-dot--used' : ''}`}
              />
            ))}
          </div>
        )}

        <button className="lock-reset" onClick={onReset}>
          Forgot password? Reset all data →
        </button>
      </div>
    </div>
  )
}
