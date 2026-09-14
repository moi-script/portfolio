export interface Act {
  id: string
  index: string
  title: string
  kicker: string
  body: string
}

export const acts: Act[] = [
  {
    id: 'cpp',
    index: '01',
    title: 'Learning C++',
    kicker: 'Before college',
    body: "My first language was C++. It's strict and low level, and it made me understand memory, pointers, and logic before I ever built anything visual. I didn't enjoy it much at the time, but I'm glad I started there.",
  },
  {
    id: 'first-web-project',
    index: '02',
    title: 'My first web project',
    kicker: '1st year',
    body: "For my OOP subject I built Game Trigger with HTML, CSS, and JavaScript. After C++, seeing my code show up on screen right away was a big change. It won 1st place at CompEng Week, and that's when I decided I wanted to keep doing web development.",
  },
  {
    id: 'first-full-stack-app',
    index: '03',
    title: 'My first full-stack app',
    kicker: '2nd year',
    body: "For DSA I built the Engineering Portal, with separate logins for admins, teachers, and students, a real-time chat, and progress charts. I built the frontend first and had to rewrite a lot of it when the data didn't fit, so now I design the database schema before anything else. That project tested my patience more than any exam did.",
  },
  {
    id: 'recepta',
    index: '04',
    title: 'Building Recepta',
    kicker: 'Now',
    body: "Right now I'm working on Recepta, which I want to turn into my first SaaS. It runs on the MERN stack with Azure OCR and RAG. Almost every part of it leans on an open source library or someone else's API, and it made me realize how much of software is people building on each other's work.",
  },
]
