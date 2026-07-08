import { acts } from '../data/story'
import { Reveal } from '../components/Reveal'

export function Story() {
  return (
    <section id="story" style={{ position: 'relative' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 48px' }}>
        <Reveal>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--fg-faint)',
              margin: '0 0 10px',
            }}
          >
            Background
          </p>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(26px,4vw,44px)',
              color: 'var(--fg)',
              margin: '0 0 48px',
              letterSpacing: '-0.02em',
            }}
          >
            From C++ to shipping systems.
          </h2>
        </Reveal>

        {/* Formal vertical timeline */}
        <div style={{ position: 'relative', paddingLeft: 8 }}>
          {/* connecting line */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: 27,
              top: 12,
              bottom: 12,
              width: 1,
              background: 'var(--border)',
            }}
          />

          {acts.map((act, i) => (
            <Reveal key={act.id} delay={i * 0.05}>
              <div
                style={{
                  display: 'flex',
                  gap: 24,
                  alignItems: 'flex-start',
                  marginBottom: i === acts.length - 1 ? 0 : 28,
                }}
              >
                {/* index badge */}
                <div
                  style={{
                    flexShrink: 0,
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-elev)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: 13,
                    color: 'var(--accent-2)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {act.index}
                </div>

                {/* content */}
                <div
                  style={{
                    flex: 1,
                    padding: '4px 0 8px',
                    borderBottom: i === acts.length - 1 ? 'none' : '1px solid var(--border)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 12,
                      flexWrap: 'wrap',
                      marginBottom: 8,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 800,
                        fontSize: 19,
                        color: 'var(--fg)',
                        margin: 0,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {act.title}
                    </h3>
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--fg-faint)',
                      }}
                    >
                      {act.kicker}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: 'var(--fg-muted)',
                      margin: 0,
                      maxWidth: 640,
                    }}
                  >
                    {act.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
