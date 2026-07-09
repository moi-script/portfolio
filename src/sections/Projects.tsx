import { projects } from '../data/projects'
import { ProjectCard } from './ProjectCard'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

export function Projects() {
  return (
    <section id="projects" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
      <SectionHeading kicker="What I've built" title="Featured Projects" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={(i % 2) * 0.08}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
