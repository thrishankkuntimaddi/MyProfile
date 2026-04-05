import { useState, useEffect, useRef } from 'react'
import { X, Copy, Check, QrCode } from 'lucide-react'
import QRCode from 'qrcode'
import LZString from 'lz-string'

// Compress profile into a short-ish URL component
function encodeProfile(profile) {
  try {
    return LZString.compressToEncodedURIComponent(JSON.stringify(profile))
  } catch {
    return null
  }
}

// Always use the deployed (GitHub Pages) URL as the base if possible,
// otherwise fall back to current origin+path
function getShareUrl(profile) {
  const encoded = encodeProfile(profile)
  if (!encoded) return window.location.href

  // On GitHub Pages the pathname starts with /MyProfile/
  const base = window.location.hostname === 'localhost'
    ? 'https://thrishankkuntimaddi.github.io/MyProfile/'
    : `${window.location.origin}${window.location.pathname}`

  return `${base}#share=${encoded}`
}

export function ShareModal({ profile, onClose }) {
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef(null)

  const shareUrl = getShareUrl(profile)

  // Draw QR code onto canvas
  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, shareUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#b8956a',   // accent colour
        light: '#111111',  // card bg
      },
    }).catch(console.error)
  }, [shareUrl])

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  return (
    <div className="edit-overlay" onClick={onClose}>
      <div className="edit-modal share-modal-sized" onClick={(e) => e.stopPropagation()}>

        <div className="edit-modal__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <QrCode size={14} style={{ color: 'var(--accent)' }} />
            <span className="edit-modal__title">Share Profile</span>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={15} /></button>
        </div>

        <div className="edit-modal__body share-modal-body">

          {/* QR Code canvas */}
          <div className="share-qr">
            <canvas ref={canvasRef} style={{ display: 'block' }} />
          </div>

          {/* URL row */}
          <div className="share-url-row">
            <span className="share-url-text">
              {window.location.hostname === 'localhost'
                ? 'QR points to GitHub Pages (deploy first)'
                : shareUrl.slice(0, 56) + (shareUrl.length > 56 ? '…' : '')}
            </span>
            <button className="btn-copy" onClick={handleCopy}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <p className="share-note">
            Scan to open your profile instantly.
            Data is encoded in the URL — no server, no login needed.
          </p>
        </div>

        <div className="edit-modal__footer">
          <button className="btn-ghost" style={{ marginLeft: 'auto' }} onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  )
}
