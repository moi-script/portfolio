import { SiArduino, SiEspressif, SiGoogle, SiRoboflow } from 'react-icons/si'

// What I'm focused on right now, drawn as detections in a camera frame.
const DETECTIONS = [
  {
    label: 'focus', conf: '0.98',
    title: 'Computer Vision + AI',
    body: 'Training and testing detection models in Roboflow, and using NotebookLM to work through papers and docs.',
  },
  {
    label: 'journey', conf: '0.91',
    title: 'Mechatronics',
    body: 'A lab trainer simulator, a PCB pen plotter, and ESP32 sensor boards.',
    link: { href: '#projects', text: 'See projects' },
  },
]

const TOOLS = [
  { name: 'Roboflow', Icon: SiRoboflow },
  { name: 'NotebookLM', Icon: SiGoogle },
  { name: 'ESP32', Icon: SiEspressif },
  { name: 'Arduino', Icon: SiArduino },
]

export function NowPanel() {
  return (
    <div id="now" className="now-wrap">
      <section className="showcase now" aria-label="What I'm working on now">
        <div className="aurora" aria-hidden><span /><span /><span /></div>

        <ul className="now-list">
          {DETECTIONS.map((d) => (
            <li key={d.label} className="bbox">
              <span className="bbox-tag">{d.label} {d.conf}</span>
              <h3>{d.title}</h3>
              <p>{d.body}</p>
              {d.link && (
                <a href={d.link.href} {...(d.link.href.startsWith('#') ? {} : { target: '_blank', rel: 'noreferrer' })}>
                  {d.link.text} →
                </a>
              )}
            </li>
          ))}
        </ul>

        <footer className="now-tools">
          <span>Daily tools</span>
          <ul>
            {TOOLS.map(({ name, Icon }) => (
              <li key={name}><Icon size={13} aria-hidden /> {name}</li>
            ))}
          </ul>
        </footer>
      </section>
    </div>
  )
}
