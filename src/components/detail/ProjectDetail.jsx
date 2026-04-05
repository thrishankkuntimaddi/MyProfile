import { Globe, Video, ExternalLink } from 'lucide-react'

export function ProjectDetail({ project }) {
  if (!project) return null
  const { name, description, tech, url, github, youtube } = project

  return (
    <>
      <div className="detail-title">{name}</div>
      {tech?.length > 0 && (
        <div className="detail-role">{tech.join(' · ')}</div>
      )}
      <div className="detail-divider" />

      {description && (
        <div className="detail-section">
          <div className="detail-section__label">About</div>
          <div className="detail-body">{description}</div>
        </div>
      )}

      {tech?.length > 0 && (
        <div className="detail-section">
          <div className="detail-section__label">Tech Stack</div>
          <div className="detail-tags" style={{ marginTop: 8 }}>
            {tech.map((t, i) => <span key={i} className="tag">{t}</span>)}
          </div>
        </div>
      )}

      {(github || url || youtube) && (
        <div className="detail-section">
          <div className="detail-section__label">Links</div>
          <div className="detail-links" style={{ marginTop: 8 }}>
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className="detail-link-btn">
                <Globe size={12} /> GitHub
              </a>
            )}
            {url && (
              <a href={url} target="_blank" rel="noopener noreferrer" className="detail-link-btn">
                <ExternalLink size={12} /> Live Demo
              </a>
            )}
            {youtube && (
              <a href={youtube} target="_blank" rel="noopener noreferrer" className="detail-link-btn">
                <Video size={12} /> YouTube
              </a>
            )}
          </div>
        </div>
      )}
    </>
  )
}
