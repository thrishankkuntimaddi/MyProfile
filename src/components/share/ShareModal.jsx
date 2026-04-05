import { useState, useEffect, useRef } from 'react'
import { X, Copy, Check, QrCode, Link2 } from 'lucide-react'
import QRCode from 'qrcode'
import LZString from 'lz-string'

function encodeProfile(profile) {
  try {
    return LZString.compressToEncodedURIComponent(JSON.stringify(profile))
  } catch {
    return null
  }
}

// The QR always points to the clean deployed URL (always short → always scannable)
// The copy button gives the full profile-encoded URL (for exact data transfer)
function getUrls(profile) {
  const isLocal  = window.location.hostname === 'localhost'
  const baseUrl  = isLocal
    ? 'https://thrishankkuntimaddi.github.io/MyProfile/'
    : `${window.location.origin}${window.location.pathname}`

  const encoded  = encodeProfile(profile)
  const shareUrl = encoded ? `${baseUrl}#share=${encoded}` : baseUrl

  return { qrUrl: baseUrl, shareUrl }
}

export function ShareModal({ profile, onClose }) {
  const [copied,   setCopied]   = useState(false)
  const [qrError,  setQrError]  = useState(false)
  const canvasRef = useRef(null)

  const { qrUrl, shareUrl } = getUrls(profile)

  useEffect(() => {
    if (!canvasRef.current) return
    setQrError(false)
    QRCode.toCanvas(canvasRef.current, qrUrl, {
      width: 200,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark:  '#b8956a',
        light: '#111111',
      },
    }).catch((err) => {
      console.error('QR generation failed:', err)
      setQrError(true)
    })
  }, [qrUrl])

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  return (
    <div className="edit-overlay" onClick={onClose}>
      <div className="edit-modal share-modal-sized" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="edit-modal__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <QrCode size={14} style={{ color: 'var(--accent)' }} />
            <span className="edit-modal__title">Share Profile</span>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={15} /></button>
        </div>

        {/* Body */}
        <div className="edit-modal__body share-modal-body">

          {/* QR Code */}
          <div className="share-qr">
            {qrError ? (
              <div className="share-qr-error">
                <QrCode size={32} style={{ opacity: 0.3 }} />
                <span>QR unavailable</span>
              </div>
            ) : (
              <canvas ref={canvasRef} style={{ display: 'block' }} />
            )}
          </div>

          {/* QR label */}
          <p className="share-qr-label">
            Scan to open your profile →
          </p>

          {/* Divider */}
          <div className="share-divider">
            <span>or copy link with profile data</span>
          </div>

          {/* URL row */}
          <div className="share-url-row">
            <Link2 size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <span className="share-url-text">
              {shareUrl.slice(0, 52)}{shareUrl.length > 52 ? '…' : ''}
            </span>
            <button className="btn-copy" onClick={handleCopy}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <p className="share-note">
            Profile data is encoded in the link — no server needed.
          </p>
        </div>

        {/* Footer */}
        <div className="edit-modal__footer">
          <button className="btn-ghost" style={{ marginLeft: 'auto' }} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
