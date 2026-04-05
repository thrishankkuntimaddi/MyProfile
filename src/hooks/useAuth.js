import { useState, useCallback } from 'react'

const AUTH_KEY = 'myprofile_auth'
const MAX_ATTEMPTS = 5

function encode(pwd) {
  return btoa(encodeURIComponent(pwd))
}

function verify(pwd, stored) {
  return encode(pwd) === stored
}

export function useAuth() {
  // hasPassword reads localStorage on every render — always current
  const hasPassword = !!localStorage.getItem(AUTH_KEY)

  const [unlocked, setUnlocked] = useState(!hasPassword)
  const [attempts, setAttempts]  = useState(0)
  const [locked, setLocked]      = useState(false) // permanent lockout

  /** Set a new password (first time or change) */
  const setPassword = useCallback((password) => {
    if (!password?.trim()) return
    localStorage.setItem(AUTH_KEY, encode(password))
  }, [])

  /** Verify current password then change to new one. Returns true on success. */
  const changePassword = useCallback((current, next) => {
    const stored = localStorage.getItem(AUTH_KEY)
    if (!stored) return false
    if (!verify(current, stored)) return false
    localStorage.setItem(AUTH_KEY, encode(next))
    return true
  }, [])

  /** Verify current password then remove it. Returns true on success. */
  const deletePassword = useCallback((current) => {
    const stored = localStorage.getItem(AUTH_KEY)
    if (!stored) { return true }
    if (!verify(current, stored)) return false
    localStorage.removeItem(AUTH_KEY)
    setUnlocked(true)
    return true
  }, [])

  /** Lock the session (stays unlocked=false until password entered) */
  const lock = useCallback(() => {
    if (localStorage.getItem(AUTH_KEY)) {
      setUnlocked(false)
      setAttempts(0)
    }
  }, [])

  /** Try to unlock with a password. Returns true on success. */
  const unlock = useCallback((password) => {
    const stored = localStorage.getItem(AUTH_KEY)
    if (!stored) { setUnlocked(true); return true }

    if (verify(password, stored)) {
      setUnlocked(true)
      setAttempts(0)
      return true
    }

    const next = attempts + 1
    setAttempts(next)
    if (next >= MAX_ATTEMPTS) {
      localStorage.clear()
      setLocked(true)
    }
    return false
  }, [attempts])

  /** Nuclear reset — clears everything */
  const clearAll = useCallback(() => {
    localStorage.clear()
    window.location.reload()
  }, [])

  return {
    hasPassword,
    unlocked,
    locked,
    attempts,
    attemptsLeft: MAX_ATTEMPTS - attempts,
    setPassword,
    changePassword,
    deletePassword,
    lock,
    unlock,
    clearAll,
  }
}
