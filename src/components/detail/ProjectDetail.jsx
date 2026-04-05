import { Globe, ExternalLink, Video } from 'lucide-react'
import { SectionLabel } from '../shared/SectionLabel'
import { TagList } from '../shared/TagList'

export function ProjectDetail({ project }) {
  if (!project) return null
  const { name, description, tech, url, github, youtube } = project

  return (
    <div className="section-inner anim-expand">
      <div className="detail-title">{name}</div>
      {tech?.length > 0 && (
        <div className="detail-subtitle">{tech.join(' · ')}</div>
      )}

      {description && (
        <div className="detail-section">
          <div className="detail-section__heading">Description</div>
          <div className="detail-section__body">{description}</div>
        </div>
      )}

      {tech?.length > 0 && (
        <div className="detail-section">
          <div className="detail-section__heading">Tech Stack</div>
          <div style={{ marginTop: 'var(--sp-2)' }}>
            <TagList items={tech} />
          </div>
        </div>
      )}

      {(github || url || youtube) && (
        <div className="detail-section">
          <div className="detail-section__heading">Links</div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap', marginTop: 'var(--sp-2)' }}>
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className="detail-link">
                <Globe size={13} /> GitHub
              </a>
            )}
            {url && (
              <a href={url} target="_blank" rel="noopener noreferrer" className="detail-link">
                <ExternalLink size={13} /> Live Demo
              </a>
            )}
            {youtube && (
              <a href={youtube} target="_blank" rel="noopener noreferrer" className="detail-link">
                <Video size={13} /> YouTube
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
