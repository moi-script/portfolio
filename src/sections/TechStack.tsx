import type { IconType } from 'react-icons'
import { FiDatabase, FiLayout, FiServer, FiTool } from 'react-icons/fi'
import { skillGroups } from '../data/skills'
import { skillIcons } from '../data/skillIcons'

const GROUP_ICONS: Record<string, IconType> = {
  Frontend: FiLayout,
  Backend: FiServer,
  Database: FiDatabase,
  'DevOps & Tools': FiTool,
}

const SHORT_NAMES: Record<string, string> = { 'DevOps & Tools': 'Tools' }

// "Languages" only repeats the other groups, so the landing shows the four core ones.
const groups = skillGroups.filter((g) => g.category in GROUP_ICONS)

export function TechStack() {
  return (
    <div className="stack">
      <div className="stack-head">
        <h2>Tech stack</h2>
        <span>{groups.reduce((n, g) => n + g.items.length, 0)} tools</span>
      </div>
      <div className="stack-grid">
        {groups.map((group, i) => {
          const GroupIcon = GROUP_ICONS[group.category]
          return (
            <section key={group.category} className="stack-tile">
              <header className="stack-tile-head">
                <span className="stack-tile-icon"><GroupIcon size={14} aria-hidden /></span>
                <h3>{SHORT_NAMES[group.category] ?? group.category}</h3>
                <span className="stack-tile-num">0{i + 1}</span>
              </header>
              <ul className="stack-list">
                {group.items.map((item) => {
                  const icon = skillIcons[item]
                  return (
                    <li key={item}>
                      {icon && <icon.Icon size={14} color={icon.color ?? 'var(--fg)'} aria-hidden />}
                      <span>{item}</span>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
