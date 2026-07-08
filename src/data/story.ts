export interface Act {
  id: string
  index: string
  title: string
  kicker: string
  body: string
}

export const acts: Act[] = [
  {
    id: 'foundation',
    index: '01',
    title: 'The Foundation',
    kicker: 'Before College',
    body: "C++ was my first language. Low-level, rigid, disciplined. It taught me how computers actually think — memory, pointers, logic. A tough but necessary foundation.",
  },
  {
    id: 'spark',
    index: '02',
    title: 'The Spark',
    kicker: '1st Year',
    body: "Game Trigger was built with HTML, CSS, and JavaScript in my OOP subject. Moving from C++ to the DOM felt like moving from a calculator to a canvas. Won 1st place in CompEng Week. Passion ignited.",
  },
  {
    id: 'trial',
    index: '03',
    title: 'The Trial',
    kicker: '2nd Year',
    body: "Engineering Portal for DSA class. Built a multi-role system with real-time chat and data visualization. Learned the hard lesson: always design the database schema first. Patience was tested. Character was built.",
  },
  {
    id: 'ascent',
    index: '04',
    title: 'The Ascent',
    kicker: 'Now',
    body: "Recepta — my first SaaS attempt. Azure OCR, RAG, AI text detection, full MERN stack. The project that made me realize the beauty of open source and software as a global collaboration.",
  },
]
