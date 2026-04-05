import { useState } from 'react'
import { X, Copy, Check } from 'lucide-react'

function encodeProfile(profile) {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(profile))))
  } catch {
    return null
  }
}

export function ShareModal({ profile, onClose }) {
  const [copied, setCopied] = useState(false)

  const encoded = encodeProfile(profile)
  const base = `${window.location.origin}${window.location.pathname}`
  const shareUrl = encoded ? `${base}#share=${encoded}` : base

  // QR via free API — dark theme colours
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}&color=b8956a&bgcolor=111111`

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="edit-overlay" onClick={onClose}>
      <div className="edit-modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>

        <div className="edit-modal__header">
          <span className="edit-modal__title">Share Profile</span>
          <button className="btn-icon" onClick={onClose}><X size={15} /></button>
        </div>

        <div className="edit-modal__body" style={{ gap: 24, alignItems: 'center', display: 'flex', flexDirection: 'column' }}>

          {/* QR Code */}
          <div className="share-qr">
            <img
              src={qrUrl}
              alt="QR code for profile"
              width={180}
              height={180}
              style={{ display: 'block' }}
            />
          </div>

          {/* URL row */}
          <div className="share-url-row">
            <span className="share-url-text">{shareUrl.slice(0, 60)}{shareUrl.length > 60 ? '…' : ''}</span>
            <button className="btn-copy" onClick={handleCopy}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <p className="share-note">
            Anyone with this link can view your profile in read-only mode.
            Your data stays on your device — it's encoded in the URL.
          </p>
        </div>

        <div className="edit-modal__footer">
          <div style={{ marginLeft: 'auto' }}>
            <button className="btn-ghost" onClick={onClose}>Close</button>
          </div>
        </div>

      </div>
    </div>
  )
}
