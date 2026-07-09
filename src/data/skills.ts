export interface SkillGroup {
  category: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  { category: 'Frontend', items: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Next.js'] },
  { category: 'Backend', items: ['Node.js', 'Express', 'Spring Boot', 'REST APIs', 'JWT Auth', 'WebSockets'] },
  { category: 'Database', items: ['MongoDB', 'PostgreSQL', 'Redis', 'Firebase'] },
  { category: 'DevOps & Tools', items: ['Git', 'GitHub', 'Docker', 'Vercel', 'Railway'] },
  { category: 'Languages', items: ['C++', 'C', 'Python', 'JavaScript', 'TypeScript'] },
]
