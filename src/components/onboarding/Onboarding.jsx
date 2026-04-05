import { useState, useRef } from 'react'
import { Upload } from 'lucide-react'
import { extractTextFromPDF } from '../../parser/pdfParser'
import { extractTextFromFile } from '../../parser/textParser'
import { mapTextToProfile } from '../../parser/structureMapper'

export function Onboarding({ onComplete }) {
  const [dragOver, setDragOver] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const [parsing, setParsing] = useState(false)
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [showPasswordStep, setShowPasswordStep] = useState(false)
  const [parsedData, setParsedData] = useState(null)
  const fileRef = useRef()

  async function processFile(file) {
    setError('')
    setParsing(true)
    try {
      let text = ''
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        text = await extractTextFromPDF(file)
      } else {
        text = await extractTextFromFile(file)
      }
      const data = mapTextToProfile(text)
      setParsedData(data)
      setShowPasswordStep(true)
    } catch (e) {
      setError('Failed to parse file. Please try a different format.')
    } finally {
      setParsing(false)
    }
  }

  async function processPaste() {
    if (!pasteText.trim()) {
      setError('Please paste your profile text first.')
      return
    }
    setError('')
    setParsing(true)
    try {
      const data = mapTextToProfile(pasteText)
      setParsedData(data)
      setShowPasswordStep(true)
    } catch (e) {
      setError('Failed to parse text.')
    } finally {
      setParsing(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  function handleFileInput(e) {
    const file = e.target.files[0]
    if (file) processFile(file)
  }

  function handleFinish() {
    onComplete(parsedData, password || null)
  }

  if (parsing) {
    return (
      <div className="fullscreen-center">
        <div className="parsing-overlay" style={{ position: 'relative', inset: 'auto', background: 'none' }}>
          <div className="parsing-label">Parsing your profile…</div>
          <div className="parsing-bar-track">
            <div className="parsing-bar-fill" />
          </div>
        </div>
      </div>
    )
  }

  if (showPasswordStep && parsedData) {
    return (
      <div className="fullscreen-center">
        <div className="onboarding-box">
          <div className="onboarding-title">Profile ready</div>
          <div className="onboarding-sub">
            {parsedData.profile.name
              ? `Found: ${parsedData.profile.name}`
              : 'Data extracted successfully.'}
            {' '}You can edit any field after loading.
          </div>

          <div className="password-setup">
            <div className="password-setup__label">
              Protect with a password? <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
            </div>
            <input
              type="password"
              className="password-setup__input"
              placeholder="Leave blank to skip"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFinish()}
            />
          </div>

          <button className="btn-primary" style={{ width: '100%', marginTop: 'var(--sp-4)' }} onClick={handleFinish}>
            Open MyProfile →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fullscreen-center">
      <div className="onboarding-box">
        <div className="onboarding-title">MyProfile</div>
        <div className="onboarding-sub">Set up your profile to get started.</div>

        {/* File drop zone */}
        <div
          className={`drop-zone${dragOver ? ' drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <div className="drop-zone__icon">
            <Upload size={20} />
          </div>
          <div className="drop-zone__text">Drop your resume here or click to upload</div>
          <div className="drop-zone__hint">PDF · TXT · DOC</div>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
        </div>

        <div className="divider-or">or</div>

        {/* Paste text */}
        <textarea
          className="onboarding-textarea"
          placeholder="Paste your LinkedIn About / Experience text here…"
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
        />

        {error && (
          <div style={{ fontSize: 12, color: '#e05252', marginBottom: 'var(--sp-3)' }}>{error}</div>
        )}

        <button
          className="btn-primary"
          style={{ width: '100%' }}
          onClick={processPaste}
          disabled={!pasteText.trim()}
        >
          Continue →
        </button>

        <div className="onboarding-note">All data is stored locally on this device only.</div>
      </div>
    </div>
  )
}
