import { useState, useRef, useCallback, useEffect } from 'react'
import { useProfile } from './hooks/useProfile'
import { useAuth } from './hooks/useAuth'
import { useNavigation } from './hooks/useNavigation'

import { Onboarding }  from './components/onboarding/Onboarding'
import { LockScreen }  from './components/auth/LockScreen'
import { Header }      from './components/layout/Header'
import { Footer }      from './components/layout/Footer'
import { Overview }    from './components/layout/Overview'
import { EditModal }   from './components/edit/EditModal'
import { ShareModal }  from './components/share/ShareModal'

import { ExperienceSection } from './components/sections/ExperienceSection'
import { EducationSection }  from './components/sections/EducationSection'
import { SkillsSection }     from './components/sections/SkillsSection'
import { ProjectsSection }   from './components/sections/ProjectsSection'
import { LinksSection }      from './components/sections/LinksSection'

import { ProjectDetail }                from './components/detail/ProjectDetail'
import { ExperienceDetail, EducationDetail } from './components/detail/index'

const ANIM = 180

export default function App() {
  const { profile, saveProfile, clearProfile, updateProfile } = useProfile()
  const { hasPassword, unlocked, locked, attemptsLeft, setPassword, unlock, clearAll } = useAuth()
  const { view, openSection, openItem, goBack, goHome } = useNavigation()

  // ── Transition state ─────────────────────────────────────────────────────
  const [exitingSection, setExitingSection] = useState(false)
  const [exitingDetail,  setExitingDetail]  = useState(false)
  const exitTimer = useRef(null)

  // ── Edit modal state ─────────────────────────────────────────────────────
  // { section: string, index: number|null, data: object }
  const [editState, setEditState] = useState(null)

  // ── Share modal ──────────────────────────────────────────────────────────
  const [shareOpen, setShareOpen] = useState(false)

  // ── Shared profile (URL hash read-only view) ─────────────────────────────
  const [sharedProfile, setSharedProfile] = useState(null)

  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith('#share=')) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(hash.slice(7)))))
        setSharedProfile(decoded)
        window.location.hash = ''
      } catch { /* ignore malformed */ }
    }
  }, [])

  // ── Animated back ────────────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    if (exitTimer.current) clearTimeout(exitTimer.current)
    if (view.level === 2) {
      setExitingDetail(true)
      exitTimer.current = setTimeout(() => { setExitingDetail(false); goBack() }, ANIM)
    } else if (view.level === 1) {
      setExitingSection(true)
      exitTimer.current = setTimeout(() => { setExitingSection(false); goBack() }, ANIM)
    } else goBack()
  }, [view.level, goBack])

  const handleHome = useCallback(() => {
    if (exitTimer.current) clearTimeout(exitTimer.current)
    setExitingSection(true); setExitingDetail(true)
    exitTimer.current = setTimeout(() => {
      setExitingSection(false); setExitingDetail(false); goHome()
    }, ANIM)
  }, [goHome])

  // ── Edit helpers ─────────────────────────────────────────────────────────
  function openEdit(section, index, data) {
    setEditState({ section, index, data })
  }

  function handleSave(updatedData) {
    const { section, index } = editState
    const next = { ...profile }

    if (section === 'profile') {
      next.profile = { ...next.profile, ...updatedData }
    } else if (section === 'links') {
      next.links = { ...next.links, ...updatedData }
    } else if (section === 'skills') {
      next.skills = updatedData
    } else {
      const list = [...(next[section] || [])]
      if (index !== null && index >= 0) list[index] = updatedData
      else list.push(updatedData)
      next[section] = list
    }

    updateProfile(next)
    setEditState(null)
  }

  function handleDelete() {
    const { section, index } = editState
    const next = { ...profile }
    next[section] = next[section].filter((_, i) => i !== index)
    updateProfile(next)
    setEditState(null)
  }

  // ── Auth guards ──────────────────────────────────────────────────────────
  if (locked) {
    return (
      <div className="fullscreen-center">
        <div className="lock-box anim-fade">
          <div className="lock-title">Access Revoked</div>
          <div className="lock-sub">Too many failed attempts.</div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => window.location.reload()}>
            Start Over
          </button>
        </div>
      </div>
    )
  }

  if (profile && hasPassword && !unlocked) {
    return <LockScreen onUnlock={unlock} onReset={clearAll} attemptsLeft={attemptsLeft} />
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

  // If a shared profile came in from URL, show it in read-only overview
  if (sharedProfile) {
    return (
      <div className="app-layout">
        <header className="app-header">
          <span className="header-brand">MyProfile <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 11 }}>· shared view</span></span>
          <button className="btn-ghost" onClick={() => setSharedProfile(null)}>← Back to mine</button>
        </header>
        <main className="app-content">
          <Overview profile={sharedProfile} onOpenSection={() => {}} />
        </main>
        <Footer profile={sharedProfile} />
      </div>
    )
  }

  // ── Section content ──────────────────────────────────────────────────────
  function renderSectionContent() {
    switch (view.section) {
      case 'experience':
        return (
          <ExperienceSection
            experience={profile.experience}
            onSelect={openItem}
            onAdd={() => openEdit('experience', null, null)}
            onEdit={(i, d) => openEdit('experience', i, d)}
            onDelete={(i) => {
              if (window.confirm('Delete this entry?')) {
                const next = { ...profile, experience: profile.experience.filter((_, idx) => idx !== i) }
                updateProfile(next)
              }
            }}
          />
        )
      case 'education':
        return (
          <EducationSection
            education={profile.education}
            onSelect={openItem}
            onAdd={() => openEdit('education', null, null)}
            onEdit={(i, d) => openEdit('education', i, d)}
            onDelete={(i) => {
              if (window.confirm('Delete this entry?')) {
                const next = { ...profile, education: profile.education.filter((_, idx) => idx !== i) }
                updateProfile(next)
              }
            }}
          />
        )
      case 'skills':
        return (
          <SkillsSection
            skills={profile.skills}
            onEdit={() => openEdit('skills', null, profile.skills)}
          />
        )
      case 'projects':
        return (
          <ProjectsSection
            projects={profile.projects}
            onSelect={openItem}
            onAdd={() => openEdit('projects', null, null)}
            onEdit={(i, d) => openEdit('projects', i, d)}
            onDelete={(i) => {
              if (window.confirm('Delete this project?')) {
                const next = { ...profile, projects: profile.projects.filter((_, idx) => idx !== i) }
                updateProfile(next)
              }
            }}
          />
        )
      case 'links':
        return (
          <LinksSection
            links={profile.links}
            onEdit={() => openEdit('links', null, profile.links)}
          />
        )
      default:
        return null
    }
  }

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
        onReset={() => { if (window.confirm('Reset all data?')) clearAll() }}
        onLock={() => window.location.reload()}
        onShare={() => setShareOpen(true)}
      />

      <main className="app-content">
        {/* Base layer: always visible */}
        <Overview
          profile={profile}
          onOpenSection={openSection}
          onEditProfile={() => openEdit('profile', null, profile.profile)}
        />

        {/* Section overlay */}
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

        {/* Detail overlay */}
        {(view.level === 2 || exitingDetail) && (
          <div className={`detail-overlay ${exitingDetail ? 'anim-detail-out' : 'anim-detail-in'}`}>
            <div className="detail-content">
              {renderDetailContent()}
            </div>
          </div>
        )}
      </main>

      <Footer profile={profile} />

      {/* Edit modal */}
      {editState && (
        <EditModal
          editState={editState}
          onSave={handleSave}
          onDelete={editState.index !== null ? handleDelete : null}
          onClose={() => setEditState(null)}
        />
      )}

      {/* Share modal */}
      {shareOpen && (
        <ShareModal profile={profile} onClose={() => setShareOpen(false)} />
      )}
    </div>
  )
}
