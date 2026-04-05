import { useState, useCallback } from 'react'

const STORAGE_KEY = 'myprofile_data'

export function useProfile() {
  const [profile, setProfileState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  const saveProfile = useCallback((data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      setProfileState(data)
    } catch (e) {
      console.error('Failed to save profile:', e)
    }
  }, [])

  const clearProfile = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setProfileState(null)
  }, [])

  const updateSection = useCallback((section, value) => {
    setProfileState((prev) => {
      const updated = { ...prev, [section]: value }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error('Failed to update section:', e)
      }
      return updated
    })
  }, [])

  return { profile, saveProfile, clearProfile, updateSection }
}
