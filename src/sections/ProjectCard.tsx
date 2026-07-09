import type { Project } from '../data/projects'

export function ProjectCard({ project }: { project: Project }) {
  const shipped = project.status === 'shipped'
  return (
    <article style={{
      background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 18,
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      boxShadow: 'var(--shadow)', transition: 'transform 0.2s',
    }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-6px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {project.image && (
        <div style={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden', background: '#000' }}>
          <img src={project.image} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <span style={{
            position: 'absolute', top: 12, left: 12, padding: '4px 10px', borderRadius: 999,
            fontFamily: "'Fira Code', monospace", fontSize: 11, letterSpacing: '0.05em',
            background: 'var(--scrim)', border: '1px solid var(--scrim-border)',
            color: shipped ? '#7ee0a8' : '#e0a668',
          }}>{shipped ? 'SHIPPED' : 'IN DEVELOPMENT'}</span>
        </div>
      )}
      <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <div>
          <h3 style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: 'var(--fg)' }}>{project.name}</h3>
          <p style={{ margin: '4px 0 0', fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--fg-faint)' }}>{project.year} · {project.subject}</p>
        </div>
        <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontSize: 15, lineHeight: 1.6, color: 'var(--fg-muted)' }}>
          "{project.quote}"
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 'auto' }}>
          {project.tags.map((tag) => (
            <span key={tag} style={{
              padding: '4px 10px', borderRadius: 999, fontFamily: "'Fira Code', monospace",
              fontSize: 12, color: 'var(--fg-muted)', border: '1px solid var(--border)',
            }}>{tag}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
          {project.liveDemo && (
            <a href={project.liveDemo} target="_blank" rel="noreferrer" style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
              color: 'var(--accent)', textDecoration: 'none',
            }}>Live Demo →</a>
          )}
          <a href={project.github} target="_blank" rel="noreferrer" style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
            color: 'var(--fg-muted)', textDecoration: 'none',
          }}>GitHub →</a>
        </div>
      </div>
    </article>
  )
}
