export interface SkillGroup {
  category: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  { category: 'AI & Vision', items: ['Roboflow', 'NotebookLM', 'Claude Code', 'Codex'] },
  { category: 'Frontend', items: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Next.js'] },
  { category: 'Backend', items: ['Node.js', 'Express', 'Python', 'REST APIs', 'JWT Auth', 'WebSockets'] },
  { category: 'Database', items: ['MongoDB', 'Redis', 'Firebase'] },
  { category: 'DevOps & Tools', items: ['Git', 'GitHub', 'Docker', 'Postman', 'Vercel', 'Railway'] },
  { category: 'Languages', items: ['C++', 'Python', 'JavaScript', 'TypeScript'] },
]
