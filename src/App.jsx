import { useState, useRef, useCallback } from 'react'
import { useProfile } from './hooks/useProfile'
import { useAuth } from './hooks/useAuth'
import { useNavigation } from './hooks/useNavigation'

import { Onboarding } from './components/onboarding/Onboarding'
import { LockScreen } from './components/auth/LockScreen'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Overview } from './components/layout/Overview'

import { ExperienceSection } from './components/sections/ExperienceSection'
import { EducationSection }  from './components/sections/EducationSection'
import { SkillsSection }     from './components/sections/SkillsSection'
import { ProjectsSection }   from './components/sections/ProjectsSection'
import { LinksSection }      from './components/sections/LinksSection'

import { ProjectDetail } from './components/detail/ProjectDetail'
import { ExperienceDetail, EducationDetail } from './components/detail/index'

const ANIM_DURATION = 180 // ms

export default function App() {
  const { profile, saveProfile, clearProfile } = useProfile()
  const { hasPassword, unlocked, locked, attemptsLeft, setPassword, unlock, clearAll } = useAuth()
  const { view, openSection, openItem, goBack, goHome } = useNavigation()

  // Exit-animation state
  const [exitingSection, setExitingSection] = useState(false)
  const [exitingDetail, setExitingDetail]   = useState(false)
  const exitTimer = useRef(null)

  // ── Animated back navigation ─────────────────────────────────────────────
  const handleBack = useCallback(() => {
    if (exitTimer.current) clearTimeout(exitTimer.current)

    if (view.level === 2) {
      setExitingDetail(true)
      exitTimer.current = setTimeout(() => {
        setExitingDetail(false)
        goBack()
      }, ANIM_DURATION)
    } else if (view.level === 1) {
      setExitingSection(true)
      exitTimer.current = setTimeout(() => {
        setExitingSection(false)
        goBack()
      }, ANIM_DURATION)
    } else {
      goBack()
    }
  }, [view.level, goBack])

  const handleHome = useCallback(() => {
    if (exitTimer.current) clearTimeout(exitTimer.current)
    setExitingSection(true)
    setExitingDetail(true)
    exitTimer.current = setTimeout(() => {
      setExitingSection(false)
      setExitingDetail(false)
      goHome()
    }, ANIM_DURATION)
  }, [goHome])

  // ── Auth guards ──────────────────────────────────────────────────────────
  if (locked) {
    return (
      <div className="fullscreen-center">
        <div className="lock-box anim-fade">
          <div className="lock-title">Access Revoked</div>
          <div className="lock-sub">Too many failed attempts. All data has been cleared.</div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => window.location.reload()}>
            Start Over
          </button>
        </div>
      </div>
    )
  }

  if (profile && hasPassword && !unlocked) {
    return (
      <LockScreen
        onUnlock={unlock}
        onReset={clearAll}
        attemptsLeft={attemptsLeft}
      />
    )
  }

  if (!profile) {
    return (
      <Onboarding
        onComplete={(data, pw) => {
          saveProfile(data)
          if (pw) setPassword(pw)
          window.location.reload()
        }}
      />
    )
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  function handleReset() {
    if (window.confirm('Reset all data? This cannot be undone.')) clearAll()
  }

  // ── Section inner content ────────────────────────────────────────────────
  function renderSectionContent() {
    switch (view.section) {
      case 'experience':
        return <ExperienceSection experience={profile.experience} onSelect={openItem} />
      case 'education':
        return <EducationSection education={profile.education} onSelect={openItem} />
      case 'skills':
        return <SkillsSection skills={profile.skills} />
      case 'projects':
        return <ProjectsSection projects={profile.projects} onSelect={openItem} />
      case 'links':
        return <LinksSection links={profile.links} />
      default:
        return null
    }
  }

  // ── Detail inner content ─────────────────────────────────────────────────
  function renderDetailContent() {
    if (!view.item) return null
    switch (view.section) {
      case 'projects':   return <ProjectDetail project={view.item} />
      case 'experience': return <ExperienceDetail item={view.item} />
      case 'education':  return <EducationDetail item={view.item} />
      default:           return null
    }
  }

  // ── Main render ──────────────────────────────────────────────────────────
  return (
    <div className="app-layout">
      <Header
        view={view}
        onBack={handleBack}
        onHome={handleHome}
        onReset={handleReset}
        onLock={() => window.location.reload()}
      />

      <main className="app-content">
        {/* Level 0: Overview — always rendered as base layer */}
        <Overview profile={profile} onOpenSection={openSection} />

        {/* Level 1: Section overlay — slides in over overview */}
        {(view.level >= 1 || exitingSection) && (
          <div
            key={view.section}
            className={`section-overlay ${exitingSection ? 'anim-section-out' : 'anim-section-in'}`}
          >
            <div className="section-content">
              {renderSectionContent()}
            </div>
          </div>
        )}

        {/* Level 2: Detail overlay — zooms in over section */}
        {(view.level === 2 || exitingDetail) && (
          <div
            className={`detail-overlay ${exitingDetail ? 'anim-detail-out' : 'anim-detail-in'}`}
          >
            <div className="detail-content">
              {renderDetailContent()}
            </div>
          </div>
        )}
      </main>

      <Footer profile={profile} />
    </div>
  )
}
