import { useState } from 'react'
import { useProfile } from './hooks/useProfile'
import { useAuth } from './hooks/useAuth'
import { useNavigation } from './hooks/useNavigation'

import { Onboarding } from './components/onboarding/Onboarding'
import { LockScreen } from './components/auth/LockScreen'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { DashboardGrid } from './components/layout/DashboardGrid'

import { ProfileSection } from './components/sections/ProfileSection'
import { ExperienceSection } from './components/sections/ExperienceSection'
import { EducationSection } from './components/sections/EducationSection'
import { SkillsSection } from './components/sections/SkillsSection'
import { ProjectsSection } from './components/sections/ProjectsSection'
import { LinksSection } from './components/sections/LinksSection'

import { ProjectDetail } from './components/detail/ProjectDetail'
import { ExperienceDetail, EducationDetail } from './components/detail/index'

export default function App() {
  const { profile, saveProfile, clearProfile } = useProfile()
  const { hasPassword, unlocked, locked, attempts, attemptsLeft, setPassword, unlock, clearAll } = useAuth()
  const { view, openSection, openItem, goBack, goHome } = useNavigation()

  // ── Auth: permanently locked out ──────────────────────────────────────────
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

  // ── Auth: needs password ───────────────────────────────────────────────────
  if (profile && hasPassword && !unlocked) {
    return (
      <LockScreen
        onUnlock={unlock}
        onReset={clearAll}
        attemptsLeft={attemptsLeft}
      />
    )
  }

  // ── Onboarding: no data yet ────────────────────────────────────────────────
  if (!profile) {
    return (
      <Onboarding
        onComplete={(data, pw) => {
          saveProfile(data)
          if (pw) setPassword(pw)
          // Reload to re-evaluate auth state cleanly
          window.location.reload()
        }}
      />
    )
  }

  // ── Main UI ────────────────────────────────────────────────────────────────
  function handleReset() {
    if (window.confirm('Reset all data? This cannot be undone.')) {
      clearAll()
    }
  }

  function handleLock() {
    window.location.reload()
  }

  function renderContent() {
    // Level 0: Dashboard Grid
    if (view.level === 0) {
      return (
        <DashboardGrid
          profile={profile}
          onOpen={openSection}
        />
      )
    }

    // Level 2: Detail view
    if (view.level === 2) {
      const item = view.item
      if (view.section === 'projects') return <div className="section-overlay"><ProjectDetail project={item} /></div>
      if (view.section === 'experience') return <div className="section-overlay"><ExperienceDetail item={item} /></div>
      if (view.section === 'education') return <div className="section-overlay"><EducationDetail item={item} /></div>
    }

    // Level 1: Section views
    if (view.level === 1) {
      return (
        <div className="section-overlay">
          {view.section === 'overview' && <ProfileSection profile={profile} />}
          {view.section === 'experience' && (
            <ExperienceSection experience={profile.experience} onSelect={openItem} />
          )}
          {view.section === 'education' && (
            <EducationSection education={profile.education} onSelect={openItem} />
          )}
          {view.section === 'skills' && <SkillsSection skills={profile.skills} />}
          {view.section === 'projects' && (
            <ProjectsSection projects={profile.projects} onSelect={openItem} />
          )}
          {view.section === 'links' && <LinksSection links={profile.links} />}
        </div>
      )
    }

    return null
  }

  return (
    <div className="app-layout">
      <Header
        view={view}
        onBack={goBack}
        onHome={goHome}
        onReset={handleReset}
        onLock={handleLock}
      />

      <main className="app-content">
        {renderContent()}
      </main>

      <Footer profile={profile} />
    </div>
  )
}
