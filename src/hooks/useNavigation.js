import { useState, useCallback } from 'react'

const INITIAL = { level: 0, section: null, item: null }

export function useNavigation() {
  const [view, setView] = useState(INITIAL)

  const openSection = useCallback((section) => {
    setView({ level: 1, section, item: null })
  }, [])

  const openItem = useCallback((item) => {
    setView((v) => ({ ...v, level: 2, item }))
  }, [])

  const goBack = useCallback(() => {
    setView((v) => {
      if (v.level === 2) return { ...v, level: 1, item: null }
      return INITIAL
    })
  }, [])

  const goHome = useCallback(() => {
    setView(INITIAL)
  }, [])

  return { view, openSection, openItem, goBack, goHome }
}
