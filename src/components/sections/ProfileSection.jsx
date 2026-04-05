import { MapPin, Mail } from 'lucide-react'
import { SectionLabel } from '../shared/SectionLabel'
import { EmptyState } from '../shared/EmptyState'

export function ProfileSection({ profile }) {
  const { name, title, photo, summary, location, email } = profile?.profile || {}

  return (
    <div className="section-inner anim-expand">
      <div className="profile-hero">
        {/* Avatar */}
        <div className="profile-avatar">
          {photo ? (
            <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span>{name ? name[0].toUpperCase() : '?'}</span>
          )}
        </div>

        {/* Info */}
        <div>
          {name && <div className="profile-info__name">{name}</div>}
          {title && <div className="profile-info__title">{title}</div>}
          <div className="profile-info__meta">
            {location && (
              <span className="profile-info__meta-item">
                <MapPin size={11} /> {location}
              </span>
            )}
            {email && (
              <span className="profile-info__meta-item">
                <Mail size={11} /> {email}
              </span>
            )}
          </div>
        </div>
      </div>

      {summary ? (
        <>
          <SectionLabel>Summary</SectionLabel>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{summary}</p>
        </>
      ) : (
        <EmptyState message="No summary available" />
      )}
    </div>
  )
}
