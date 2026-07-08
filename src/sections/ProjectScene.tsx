import { useEffect, useState } from 'react'
import type { Project } from '../data/projects'
import { Reveal } from '../components/Reveal'

function JourneyDot({ active, color }: { active: boolean; color: string }) {
  return (
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: active ? color : 'transparent',
        border: `2px solid ${active ? color : 'var(--border)'}`,
        transition: 'all 0.3s',
        flexShrink: 0,
        boxShadow: active ? `0 0 10px ${color}66` : 'none',
      }}
    />
  )
}

export function ProjectScene({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const accent = project.accentColor
  const imageOnRight = index % 2 === 1

  const journeySteps = [
    { label: 'Turning Point', content: project.journey.turning_point },
    { label: 'The Struggle', content: project.journey.the_struggle },
    { label: 'What I Learned', content: project.journey.what_i_learned },
    { label: 'The Win', content: project.journey.milestone },
  ]

  useEffect(() => {
    if (!expanded) return
    const interval = setInterval(() => {
      setActiveStep(p => (p + 1) % journeySteps.length)
    }, 3200)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded])

  const isInDevelopment = project.status === 'in-development'

  const imageBlock = (
    <div
      style={{
        position: 'relative',
        minHeight: 340,
        borderRadius: 20,
        overflow: 'hidden',
        border: '1px solid var(--border)',
        background: 'var(--bg-elev)',
        flex: '1 1 46%',
      }}
    >
      {project.image && (
        <img
          src={project.image}
          alt={project.name}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
      {/* Accent overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to bottom, ${accent}22 0%, transparent 40%, rgba(0,0,0,0.35) 100%)`,
        }}
      />

      {/* Status pill */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          zIndex: 5,
          background: isInDevelopment ? `${accent}22` : 'rgba(4,7,14,0.75)',
          border: `1px solid ${isInDevelopment ? accent : 'rgba(255,255,255,0.3)'}`,
          borderRadius: 6,
          padding: '4px 10px',
          fontFamily: "'Fira Code', monospace",
          fontSize: 10,
          fontWeight: isInDevelopment ? 600 : 400,
          color: isInDevelopment ? accent : '#f1f5f9',
          letterSpacing: '0.1em',
        }}
      >
        {isInDevelopment ? 'IN DEVELOPMENT' : 'SHIPPED'}
      </div>

      {/* Tags */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 14,
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          zIndex: 5,
        }}
      >
        {project.tags.map(tag => (
          <span
            key={tag}
            style={{
              background: 'rgba(4,7,14,0.75)',
              border: '1px solid rgba(255,255,255,0.16)',
              color: '#e2e8f0',
              fontSize: 9,
              padding: '3px 8px',
              borderRadius: 4,
              fontFamily: "'Fira Code', monospace",
              letterSpacing: '0.05em',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )

  const contentBlock = (
    <div style={{ flex: '1 1 54%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <p
        style={{
          margin: '0 0 6px',
          fontFamily: "'Fira Code', monospace",
          fontSize: 11,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--fg-faint)',
        }}
      >
        {project.year} · {project.subject}
      </p>

      <h3
        style={{
          margin: '0 0 10px',
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(24px, 3vw, 34px)',
          color: 'var(--fg)',
          letterSpacing: '-0.02em',
        }}
      >
        {project.name}
      </h3>

      <p
        style={{
          margin: '0 0 20px',
          fontSize: 13,
          color: accent,
          fontFamily: "'Fira Code', monospace",
          letterSpacing: '0.02em',
          fontStyle: 'italic',
          borderLeft: `2px solid ${accent}66`,
          paddingLeft: 12,
        }}
      >
        "{project.quote}"
      </p>

      {/* Journey toggle */}
      <button
        onClick={() => setExpanded(v => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: expanded ? `${accent}15` : 'var(--bg-elev)',
          border: `1px solid ${expanded ? accent : 'var(--border)'}`,
          borderRadius: 8,
          cursor: 'pointer',
          marginBottom: 14,
          transition: 'all 0.3s',
          color: expanded ? accent : 'var(--fg-faint)',
          fontSize: 11,
          fontFamily: "'Fira Code', monospace",
          letterSpacing: '0.08em',
        }}
      >
        <span>// BUILDER JOURNEY</span>
        <span style={{ transition: 'transform 0.3s', transform: expanded ? 'rotate(90deg)' : 'rotate(0)' }}>▶</span>
      </button>

      {/* Journey content */}
      <div
        style={{
          maxHeight: expanded ? 360 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          marginBottom: expanded ? 16 : 0,
        }}
      >
        <div style={{ padding: '4px 0' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            {journeySteps.map((step, i) => (
              <button
                key={step.label}
                onClick={() => setActiveStep(i)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 0',
                  opacity: activeStep === i ? 1 : 0.5,
                  transition: 'opacity 0.2s',
                }}
              >
                <JourneyDot active={activeStep === i} color={accent} />
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "'Fira Code', monospace",
                    color: activeStep === i ? accent : 'var(--fg-faint)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {step.label}
                </span>
              </button>
            ))}
          </div>

          <div
            style={{
              padding: '14px 16px',
              background: 'var(--bg-elev)',
              borderRadius: 8,
              border: '1px solid var(--border)',
              minHeight: 80,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 12.5,
                color: 'var(--fg-muted)',
                lineHeight: 1.7,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {journeySteps[activeStep].content}
            </p>
          </div>

          {activeStep === 1 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
              {project.journey.what_i_built.map(item => (
                <span
                  key={item}
                  style={{
                    background: `${accent}15`,
                    border: `1px solid ${accent}44`,
                    color: accent,
                    fontSize: 9,
                    padding: '3px 9px',
                    borderRadius: 20,
                    fontFamily: "'Fira Code', monospace",
                    letterSpacing: '0.05em',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA links */}
      <div style={{ display: 'flex', gap: 10 }}>
        {project.liveDemo && (
          <a
            href={project.liveDemo}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '9px 16px',
              background: `${accent}15`,
              border: `1px solid ${accent}55`,
              borderRadius: 8,
              color: accent,
              fontSize: 11,
              fontFamily: "'Fira Code', monospace",
              textDecoration: 'none',
              letterSpacing: '0.05em',
            }}
          >
            ▲ Live Demo
          </a>
        )}
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          style={{
            flex: project.liveDemo ? undefined : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '9px 16px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 8,
            color: 'var(--fg-muted)',
            fontSize: 11,
            fontFamily: "'Fira Code', monospace",
            textDecoration: 'none',
            letterSpacing: '0.05em',
          }}
        >
          ⌥ GitHub
        </a>
      </div>
    </div>
  )

  return (
    <Reveal>
      <div
        className="project-scene"
        style={{
          display: 'flex',
          flexDirection: imageOnRight ? 'row-reverse' : 'row',
          gap: 48,
          alignItems: 'stretch',
          padding: '48px 0',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <style>{`
          @media (max-width: 860px) {
            .project-scene {
              flex-direction: column !important;
            }
          }
        `}</style>
        {imageBlock}
        {contentBlock}
      </div>
    </Reveal>
  )
}
