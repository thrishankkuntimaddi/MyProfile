import { Link2, Globe, AtSign, ExternalLink, MessageCircle, Video } from 'lucide-react'
import { SectionLabel } from '../shared/SectionLabel'
import { EmptyState } from '../shared/EmptyState'

const PLATFORM_CONFIG = {
  linkedin: { label: 'LinkedIn', Icon: Link2 },
  github: { label: 'GitHub', Icon: Globe },
  twitter: { label: 'Twitter / X', Icon: AtSign },
  instagram: { label: 'Instagram', Icon: AtSign },
  youtube: { label: 'YouTube', Icon: Video },
  discord: { label: 'Discord', Icon: MessageCircle },
}

export function LinksSection({ links = {} }) {
  const active = Object.entries(links).filter(([, v]) => v)

  if (!active.length) {
    return (
      <div className="section-inner anim-expand">
        <SectionLabel>Links</SectionLabel>
        <EmptyState message="No links added" />
      </div>
    )
  }

  return (
    <div className="section-inner anim-expand">
      <SectionLabel>Links</SectionLabel>
      <div className="links-list">
        {active.map(([key, url]) => {
          const config = PLATFORM_CONFIG[key]
          if (!config) return null
          const { label, Icon } = config
          return (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-row"
            >
              <div className="link-row__icon"><Icon size={16} /></div>
              <div className="link-row__name">{label}</div>
              <div className="link-row__url">{url.replace(/^https?:\/\//, '')}</div>
              <div className="link-row__arrow"><ExternalLink size={12} /></div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
