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

function getUrls(profile) {
  const isLocal  = window.location.hostname === 'localhost'
  const baseUrl  = isLocal
    ? 'https://thrishankkuntimaddi.github.io/MyProfile/'
    : `${window.location.origin}${window.location.pathname}`

  const encoded  = encodeProfile(profile)
  const shareUrl = encoded ? `${baseUrl}#share=${encoded}` : baseUrl

  return { qrUrl: baseUrl, shareUrl }
}

export function ShareModal({ profile, onClose, inline }) {
  const [copied,  setCopied]  = useState(false)
  const [qrError, setQrError] = useState(false)
  const canvasRef = useRef(null)

  const { qrUrl, shareUrl } = getUrls(profile)

  useEffect(() => {
    if (!canvasRef.current) return
    setQrError(false)
    QRCode.toCanvas(canvasRef.current, qrUrl, {
      width: inline ? 240 : 200,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#b8956a', light: '#111111' },
    }).catch(() => setQrError(true))
  }, [qrUrl, inline])

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  const body = (
    <>
      <div className="edit-modal__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <QrCode size={14} style={{ color: 'var(--accent)' }} />
          <span className="edit-modal__title">Share Profile</span>
        </div>
        <button className="btn-icon" onClick={onClose}><X size={15} /></button>
      </div>

      <div className="edit-modal__body share-modal-body">
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

        <p className="share-qr-label">Scan to open your profile →</p>

        <div className="share-divider">
          <span>or copy link with profile data</span>
        </div>

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

        <p className="share-note">Profile data is encoded in the link — no server needed.</p>
      </div>

      {!inline && (
        <div className="edit-modal__footer">
          <button className="btn-ghost" style={{ marginLeft: 'auto' }} onClick={onClose}>Close</button>
        </div>
      )}
    </>
  )

  if (inline) {
    return <div className="edit-modal share-inline">{body}</div>
  }

  return (
    <div className="edit-overlay" onClick={onClose}>
      <div className="edit-modal share-modal-sized" onClick={(e) => e.stopPropagation()}>
        {body}
      </div>
    </div>
  )
}
