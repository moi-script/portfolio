import { projects } from '../data/projects'
import type { Project } from '../data/projects'

// Strongest / most current work first. Size sets the tile's span in the grid;
// the spans add up to exactly four full rows of four.
const LAYOUT: [id: string, size?: 'xl' | 'wide'][] = [
  ['somnus', 'xl'], ['mechatronic-trainer', 'wide'], ['traceworks', 'wide'],
  ['recepta'], ['ncst-rfid'], ['lacs-band'], ['manix'],
  ['profy'], ['loca'], ['engineering-portal'], ['game-trigger'],
]

const STATUS: Record<Project['status'], string> = {
  shipped: 'Shipped',
  experimental: 'Experimental',
  'in-development': 'In dev',
}

function Tile({ project, size }: { project: Project; size?: 'xl' | 'wide' }) {
  return (
    <article className={`bento-tile${size ? ` is-${size}` : ''}`}>
      {project.image ? (
        <img className="bento-media" src={project.image} alt="" />
      ) : (
        // No screenshot (firmware): show its parts like a boot log instead.
        <pre className="bento-log" aria-hidden>
          {project.tags.map((t) => `[ OK ] ${t}`).join('\n')}
        </pre>
      )}
      <span className={`bento-status is-${project.status}`}>{STATUS[project.status]}</span>
      <div className="bento-body">
        <h3>{project.name}</h3>
        {size && <p className="bento-summary">{project.summary}</p>}
        <div className="bento-foot">
          {size === 'xl' && (
            <div className="bento-tags">
              {project.tags.slice(0, 5).map((t) => <span key={t}>{t}</span>)}
            </div>
          )}
          <div className="bento-links">
            {project.liveDemo && (
              <a href={project.liveDemo} target="_blank" rel="noreferrer" className="is-primary">
                {project.liveLabel ?? 'Live'}
              </a>
            )}
            {project.github && <a href={project.github} target="_blank" rel="noreferrer">Code</a>}
          </div>
        </div>
      </div>
    </article>
  )
}

export function ProjectBento() {
  return (
    <section id="projects" className="bento" aria-label="Projects">
      {LAYOUT.map(([id, size]) => {
        const project = projects.find((p) => p.id === id)
        return project && <Tile key={id} project={project} size={size} />
      })}
    </section>
  )
}
