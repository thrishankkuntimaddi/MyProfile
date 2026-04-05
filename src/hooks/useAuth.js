import { useState, useCallback } from 'react'

const AUTH_KEY = 'myprofile_auth'
const MAX_ATTEMPTS = 3

function encode(password) {
  return btoa(encodeURIComponent(password))
}

export function useAuth() {
  const hasPassword = !!localStorage.getItem(AUTH_KEY)
  const [unlocked, setUnlocked] = useState(!hasPassword)
  const [attempts, setAttempts] = useState(0)
  const [locked, setLocked] = useState(false) // permanently locked after 3 fails

  const setPassword = useCallback((password) => {
    if (!password) return
    localStorage.setItem(AUTH_KEY, encode(password))
  }, [])

  const removePassword = useCallback(() => {
    localStorage.removeItem(AUTH_KEY)
  }, [])

  const unlock = useCallback((password) => {
    const stored = localStorage.getItem(AUTH_KEY)
    if (!stored) {
      setUnlocked(true)
      return true
    }

    if (encode(password) === stored) {
      setUnlocked(true)
      setAttempts(0)
      return true
    }

    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    if (newAttempts >= MAX_ATTEMPTS) {
      // Clear all data on too many failed attempts
      localStorage.clear()
      setLocked(true)
    }

    return false
  }, [attempts])

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
    removePassword,
    unlock,
    clearAll,
  }
}
