import type { IconType } from 'react-icons'
import {
  SiReact, SiTypescript, SiJavascript, SiHtml5, SiCss, SiTailwindcss, SiNextdotjs,
  SiNodedotjs, SiExpress, SiSpringboot, SiJsonwebtokens,
  SiMongodb, SiPostgresql, SiRedis, SiFirebase,
  SiGit, SiGithub, SiDocker, SiPostman, SiVercel, SiRailway,
  SiCplusplus, SiC, SiPython,
} from 'react-icons/si'
import { TbApi, TbPlugConnected } from 'react-icons/tb'

export interface SkillIcon {
  Icon: IconType
  /** Official brand color. Omit for near-black marks so they render in var(--fg)
   *  and stay visible on the dark espresso theme. */
  color?: string
}

// Keys must match the item strings in skills.ts exactly.
export const skillIcons: Record<string, SkillIcon> = {
  // Frontend
  React: { Icon: SiReact, color: '#61DAFB' },
  TypeScript: { Icon: SiTypescript, color: '#3178C6' },
  JavaScript: { Icon: SiJavascript, color: '#F7DF1E' },
  HTML: { Icon: SiHtml5, color: '#E34F26' },
  CSS: { Icon: SiCss, color: '#1572B6' },
  'Tailwind CSS': { Icon: SiTailwindcss, color: '#06B6D4' },
  'Next.js': { Icon: SiNextdotjs },
  // Backend
  'Node.js': { Icon: SiNodedotjs, color: '#5FA04E' },
  Express: { Icon: SiExpress },
  'Spring Boot': { Icon: SiSpringboot, color: '#6DB33F' },
  'REST APIs': { Icon: TbApi, color: '#c8874f' },
  'JWT Auth': { Icon: SiJsonwebtokens },
  WebSockets: { Icon: TbPlugConnected, color: '#c8874f' },
  // Database
  MongoDB: { Icon: SiMongodb, color: '#47A248' },
  PostgreSQL: { Icon: SiPostgresql, color: '#4169E1' },
  Redis: { Icon: SiRedis, color: '#FF4438' },
  Firebase: { Icon: SiFirebase, color: '#FFCA28' },
  // DevOps & Tools
  Git: { Icon: SiGit, color: '#F05032' },
  GitHub: { Icon: SiGithub },
  Docker: { Icon: SiDocker, color: '#2496ED' },
  Postman: { Icon: SiPostman, color: '#FF6C37' },
  Vercel: { Icon: SiVercel },
  Railway: { Icon: SiRailway },
  // Languages
  'C++': { Icon: SiCplusplus, color: '#00599C' },
  C: { Icon: SiC, color: '#A8B9CC' },
  Python: { Icon: SiPython, color: '#3776AB' },
}
