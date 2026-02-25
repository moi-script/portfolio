import React, { useState, useEffect, useRef } from "react";

import profileImg from './assets/profile_pic.png';
// NOTE: Images are imported from your assets folder

import receptaImg from './assets/recepta.png';
import triggerImg from './assets/trigger_game.png';
import portalImg from './assets/engr_portal.png';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project {
  name: string;
  year: string;
  subject: string;
  tags: string[];
  gradient: string;
  image?: string;
  github: string;
  vercel: string;
  code: string;
  journey: {
    turning_point: string;
    the_struggle: string;
    what_i_built: string[];
    what_i_learned: string;
    milestone: string;
  };
  accentColor: string;
  quote: string;
}

// ─── Code Snippets ────────────────────────────────────────────────────────────
const CODE_SNIPPETS: Record<string, string> = {
  hero: `// Initializing System Architect Profile...
const [status, setStatus] = useState('online');
const stack = ['MongoDB','Express','React','Node','Python'];

useEffect(() => {
  initTerminalSequence();
  loadSystemProfile({
    name: 'Moi',
    role: 'Full Stack Developer',
    base: 'Cavite, PH 🇵🇭'
  });
}, []);

return <HeroSection animate={true} stack={stack} />;`,

  about: `# about_moi.py — Logic Engine
class SystemArchitect:
    def __init__(self):
        self.name = "Moi"
        self.stack = ["MERN", "Python", "AI/RAG"]
        self.split = { "hardware": 0.6, "software": 0.4 }
        self.mindset = "If it's repetitive, it's a bug"

    def solve(self, problem):
        analysis = self.analyze(problem)
        logic = self.engineer(analysis)
        return self.automate(logic)`,

  recepta: `// Recepta — AI-powered Budget Tracker
// Azure OCR Integration
const scanReceipt = async (imageFile: File) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  // Azure Computer Vision processes image
  const azureRes = await fetch('/api/ocr/analyze', {
    method: 'POST', body: formData
  });
  const { items, total, date } = await azureRes.json();

  // RAG: store in vector DB for AI recall
  await vectorStore.upsert({ items, total, date });
  
  // instant record — faster than you can think
  setBalance(prev => prev - total);
  toast("Receipt scanned! Budget updated.");
};`,

  portal: `// Engineering Portal — Multi-Role System
// Schema-first approach (learned the hard way)
const TransactionSchema = new Schema({
  role: { type: String, enum: ['admin','teacher','student'] },
  chat: [{
    from: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  progress: { type: Number, default: 0 }
});

// Real-time chat via WebSocket
io.on('connection', (socket) => {
  socket.on('message', async (data) => {
    await Message.create(data);
    io.to(data.room).emit('message', data);
  });
});`,

  trigger: `// Game Trigger — DOM Comes Alive
// My first time seeing code "live"
window.addEventListener('load', function () {
  const gameBoard = document.getElementById('board');
  
  // Browser Audio API — first time using it!
  const ctx = new AudioContext();
  const playSound = (freq) => {
    const osc = ctx.createOscillator();
    osc.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.start(); osc.stop(ctx.currentTime + 0.1);
  };

  gameBoard.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('trigger')) {
      playSound(440); // "Boom!" moment
      addScore(10);
      target.classList.add('hit');
    }
  });
});`,
};

// ─── X-Ray Overlay ────────────────────────────────────────────────────────────
const XRayOverlay: React.FC<{ code: string; visible: boolean; accent: string }> = ({ code, visible, accent }) => (
  <div style={{
    position: "absolute", inset: 0,
    background: "rgba(4, 7, 14, 0.96)",
    backdropFilter: "blur(4px)",
    borderRadius: "inherit",
    padding: "24px",
    opacity: visible ? 1 : 0,
    transition: "opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    pointerEvents: visible ? "all" : "none",
    zIndex: 10,
    overflow: "auto",
    border: `1px solid ${accent}33`,
  }}>
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: "2px",
      background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
      animation: visible ? "scanline 2.5s infinite" : "none",
    }} />
    <pre style={{
      margin: 0,
      fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
      fontSize: "11.5px",
      lineHeight: "1.75",
      color: "#7dd3fc",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    }}>
      {code.split('\n').map((line, i) => (
        <span key={i} style={{ display: "block" }}>
          <span style={{ color: "rgba(255,255,255,0.15)", userSelect: "none", marginRight: "16px", minWidth: "22px", display: "inline-block", textAlign: "right", fontSize: "10px" }}>
            {i + 1}
          </span>
          {line.startsWith('//') || line.startsWith('#') || line.startsWith('--') ? (
            <span style={{ color: "#4ade80", fontStyle: "italic" }}>{line}</span>
          ) : line.match(/\b(const|let|var|function|class|def|local|async|await|return|import|export|new|type|interface)\b/) ? (
            <span style={{ color: "#e2e8f0" }}>
              {line.split(/\b(const|let|var|function|class|def|local|async|await|return|import|export|new|type|interface)\b/).map((part, pi) =>
                ['const','let','var','function','class','def','local','async','await','return','import','export','new','type','interface'].includes(part)
                  ? <span key={pi} style={{ color: "#c084fc" }}>{part}</span>
                  : <span key={pi}>{part}</span>
              )}
            </span>
          ) : line.includes('"') || line.includes("'") ? (
            <span style={{ color: "#fbbf24" }}>{line}</span>
          ) : (
            <span style={{ color: "#94a3b8" }}>{line}</span>
          )}
        </span>
      ))}
    </pre>
  </div>
);

// ─── Journey Timeline Dot ─────────────────────────────────────────────────────
const JourneyDot: React.FC<{ active: boolean; color: string }> = ({ active, color }) => (
  <div style={{
    width: "10px", height: "10px",
    borderRadius: "50%",
    background: active ? color : "transparent",
    border: `2px solid ${active ? color : "rgba(255,255,255,0.2)"}`,
    transition: "all 0.3s",
    flexShrink: 0,
    boxShadow: active ? `0 0 10px ${color}66` : "none",
  }} />
);

// ─── Project Card (Journey-focused) ──────────────────────────────────────────
const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const [xray, setXray] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeJourneyStep, setActiveJourneyStep] = useState(0);
  const accent = project.accentColor;

  const journeySteps = [
    { label: "Turning Point", content: project.journey.turning_point },
    { label: "The Struggle", content: project.journey.the_struggle },
    { label: "What I Learned", content: project.journey.what_i_learned },
    { label: "The Win", content: project.journey.milestone },
  ];

  useEffect(() => {
    if (!expanded) return;
    const interval = setInterval(() => {
      setActiveJourneyStep(p => (p + 1) % journeySteps.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [expanded]);

  return (
    <div style={{
      background: "rgba(8, 12, 22, 0.8)",
      border: `1px solid rgba(255,255,255,0.07)`,
      borderRadius: "20px",
      overflow: "hidden",
      
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      backdropFilter: "blur(10px)",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = `${accent}44`;
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = `0 20px 60px ${accent}11`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}
    >
      {/* Image / Visual Area */}
      <div style={{ position: "relative", height: "400px", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: project.gradient,
          opacity: xray ? 0.08 : 1,
          transition: "opacity 0.35s",
        }} />
        {project.image && (
          <img src={project.image} alt={project.name} style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            opacity: xray ? 0.05 : 0.85,
            transition: "opacity 0.35s",
          }} />
        )}
        {/* Dark overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: project.image
            ? "linear-gradient(to bottom, rgba(4,7,14,0.1) 0%, rgba(4,7,14,0.85) 100%)"
            : "linear-gradient(to bottom, transparent 0%, rgba(4,7,14,0.7) 100%)",
          opacity: xray ? 0.1 : 1,
          transition: "opacity 0.35s",
        }} />

        <XRayOverlay code={project.code} visible={xray} accent={accent} />

        {/* Year badge */}
        <div style={{
          position: "absolute", top: "14px", left: "14px", zIndex: 5,
          background: "rgba(4,7,14,0.8)",
          border: `1px solid ${accent}44`,
          borderRadius: "6px",
          padding: "4px 10px",
          fontFamily: "'Fira Code', monospace",
          fontSize: "10px",
          color: accent,
          letterSpacing: "0.1em",
          opacity: xray ? 0 : 1,
          transition: "opacity 0.3s",
        }}>
          {project.year} · {project.subject}
        </div>

        {/* Tags */}
        <div style={{
          position: "absolute", bottom: "12px", left: "14px",
          display: "flex", gap: "6px", flexWrap: "wrap",
          zIndex: 5,
          opacity: xray ? 0 : 1,
          transition: "opacity 0.3s",
        }}>
          {project.tags.map(tag => (
            <span key={tag} style={{
              background: "rgba(4,7,14,0.85)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#94a3b8",
              fontSize: "9px",
              padding: "3px 8px",
              borderRadius: "4px",
              fontFamily: "'Fira Code', monospace",
              letterSpacing: "0.05em",
            }}>{tag}</span>
          ))}
        </div>

        {/* X-Ray button */}
        <button onClick={() => setXray(v => !v)} style={{
          position: "absolute", top: "12px", right: "12px", zIndex: 20,
          display: "flex", alignItems: "center", gap: "6px",
          padding: "5px 12px",
          background: xray ? `${accent}22` : "rgba(255,255,255,0.05)",
          border: `1px solid ${xray ? accent + "88" : "rgba(255,255,255,0.1)"}`,
          borderRadius: "6px",
          color: xray ? accent : "rgba(255,255,255,0.45)",
          fontSize: "10px",
          fontFamily: "'Fira Code', monospace",
          cursor: "pointer",
          letterSpacing: "0.05em",
          transition: "all 0.2s",
        }}>
          <span>{xray ? "◉" : "○"}</span>
          {xray ? "X-RAY ON" : "CODE"}
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "22px 24px 24px" }}>
        <h3 style={{
          margin: "0 0 6px",
          fontSize: "21px",
          fontFamily: "'Cabinet Grotesk', 'Syne', sans-serif",
          fontWeight: 800,
          color: "#f1f5f9",
          letterSpacing: "-0.02em",
        }}>{project.name}</h3>

        {/* Quote */}
        <p style={{
          margin: "0 0 16px",
          fontSize: "12px",
          color: accent,
          fontFamily: "'Fira Code', monospace",
          letterSpacing: "0.02em",
          fontStyle: "italic",
          borderLeft: `2px solid ${accent}55`,
          paddingLeft: "10px",
        }}>"{project.quote}"</p>

        {/* Journey toggle */}
        <button
          onClick={() => setExpanded(v => !v)}
          style={{
            width: "100%",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 14px",
            background: expanded ? `${accent}0d` : "rgba(255,255,255,0.02)",
            border: `1px solid ${expanded ? accent + "44" : "rgba(255,255,255,0.06)"}`,
            borderRadius: "8px",
            cursor: "pointer",
            // marginBottom: expanded ? "14px" : "0",
            marginBottom: "14px" ,

            transition: "all 0.3s",
            color: expanded ? accent : "#64748b",
            fontSize: "11px",
            fontFamily: "'Fira Code', monospace",
            letterSpacing: "0.08em",
          }}>
          <span >// BUILDER JOURNEY</span>
          <span style={{ transition: "transform 0.3s", transform: expanded ? "rotate(90deg)" : "rotate(0)" }}>▶</span>
        </button>

        {/* Journey content */}
        <div style={{
          maxHeight: expanded ? "320px" : "0",
          overflow: "hidden",
          transition: "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          marginBottom: expanded ? "16px" : "0",
        }}>
          <div style={{ padding: "4px 0" }}>
            {/* Step selector */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "14px", alignItems: "center" }}>
              {journeySteps.map((step, i) => (
                <button key={i} onClick={() => setActiveJourneyStep(i)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "4px 0", opacity: activeJourneyStep === i ? 1 : 0.4,
                  transition: "opacity 0.2s",
                }}>
                  <JourneyDot active={activeJourneyStep === i} color={accent} />
                  <span style={{
                    fontSize: "9px",
                    fontFamily: "'Fira Code', monospace",
                    color: activeJourneyStep === i ? accent : "#475569",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}>{step.label}</span>
                </button>
              ))}
            </div>

            <div style={{
              padding: "14px 16px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "8px",
              border: `1px solid rgba(255,255,255,0.05)`,
              minHeight: "80px",
            }}>
              <p style={{
                margin: 0,
                fontSize: "12.5px",
                color: "#94a3b8",
                lineHeight: 1.7,
                fontFamily: "'DM Sans', sans-serif",
                transition: "opacity 0.2s",
              }}>
                {journeySteps[activeJourneyStep].content}
              </p>
            </div>

            {/* What I Built chips */}
            {activeJourneyStep === 1 && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px" }}>
                {project.journey.what_i_built.map(item => (
                  <span key={item} style={{
                    background: `${accent}11`,
                    border: `1px solid ${accent}33`,
                    color: accent,
                    fontSize: "9px",
                    padding: "3px 9px",
                    borderRadius: "20px",
                    fontFamily: "'Fira Code', monospace",
                    letterSpacing: "0.05em",
                  }}>{item}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA Links */}
        <div style={{ display: "flex", gap: "10px" }}>
          <a href={project.vercel} target="_blank" rel="noreferrer" style={{
            flex: 1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            padding: "9px 16px",
            background: `${accent}15`,
            border: `1px solid ${accent}44`,
            borderRadius: "8px",
            color: accent,
            fontSize: "11px",
            fontFamily: "'Fira Code', monospace",
            textDecoration: "none",
            letterSpacing: "0.05em",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${accent}25`; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${accent}15`; }}
          >
            ▲ Live Demo
          </a>
          <a href={project.github} target="_blank" rel="noreferrer" style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "9px 16px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "8px",
            color: "#64748b",
            fontSize: "11px",
            fontFamily: "'Fira Code', monospace",
            textDecoration: "none",
            letterSpacing: "0.05em",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; }}
          >
            ⌥ GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

// ─── Animated Terminal Text ───────────────────────────────────────────────────
const TypewriterLine: React.FC<{ text: string; delay: number; typed: number; color?: string; big?: boolean }> = ({ text, delay, typed, color = "#94a3b8", big }) => (
  <div style={{
    opacity: typed > delay ? 1 : 0,
    transform: typed > delay ? "translateX(0)" : "translateX(-12px)",
    transition: "all 0.5s ease",
    marginBottom: big ? "20px" : "10px",
  }}>
    {big ? (
      <h1 style={{
        margin: 0,
        fontSize: "clamp(40px, 6vw, 72px)",
        fontFamily: "'Cabinet Grotesk', 'Syne', sans-serif",
        fontWeight: 900,
        color,
        letterSpacing: "-0.03em",
        lineHeight: 1.05,
      }}>{text}</h1>
    ) : (
      <p style={{
        margin: 0,
        fontFamily: "'Fira Code', monospace",
        fontSize: "clamp(11px, 1.3vw, 13.5px)",
        color,
        lineHeight: 1.65,
      }}>{text}</p>
    )}
  </div>
);

// ─── About Module ─────────────────────────────────────────────────────────────
const AboutModule: React.FC<{ label: string; icon: string; desc: string; active: boolean; color: string; onHover: () => void }> = ({ label, icon, desc, active, color, onHover }) => (
  <div
    onMouseEnter={onHover}
    style={{
      padding: "26px",
      background: active ? `${color}08` : "rgba(255,255,255,0.02)",
      border: `1px solid ${active ? color + "44" : "rgba(255,255,255,0.05)"}`,
      borderRadius: "14px",
      cursor: "default",
      transition: "all 0.3s",
      flex: 1, minWidth: "180px",
    }}
  >
    <div style={{
      fontSize: "22px", marginBottom: "12px",
      filter: active ? `drop-shadow(0 0 10px ${color})` : "none",
      transition: "filter 0.3s",
    }}>{icon}</div>
    <h4 style={{
      margin: "0 0 8px",
      fontFamily: "'Fira Code', monospace",
      fontSize: "11px",
      fontWeight: 600,
      color: active ? color : "#475569",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
    }}>{label}</h4>
    <p style={{
      margin: 0,
      fontSize: "13px",
      color: "#4a5568",
      lineHeight: 1.6,
      fontFamily: "'DM Sans', sans-serif",
    }}>{desc}</p>
  </div>
);

// ─── Main Portfolio ───────────────────────────────────────────────────────────
export default function MoiPortfolio() {
  const [typed, setTyped] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [heroXray, setHeroXray] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTyped(p => Math.min(p + 1, 250)), 16);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const projects: Project[] = [
    {
      name: "Recepta",
      year: "2026–Present",
      subject: "Personal SaaS Project",
      tags: ["MongoDB", "Express", "React", "Node.js", "Azure AI", "RAG", "OCR", "OpenRouter"],
      gradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
      image: receptaImg,
      github: "https://github.com/moi-script/YourCeipt",
      vercel: "https://recepta-phi.vercel.app/",
      code: CODE_SNIPPETS.recepta,
      accentColor: "#00d4ff",
      quote: "This is where I realized software is a global collaboration.",
      journey: {
        turning_point: "Recepta is my best project to date — and I'm planning to market it as my first SaaS. It was the project that made me realize how vast the software world actually is. Not just a budget tracker, it's an AI-driven financial ecosystem.",
        the_struggle: "This took a long time to build — planning, designing, database architecture, AI integration, RAG, OCR, and third-party APIs. Each layer taught me something new. The hardest part was making all these systems talk to each other seamlessly.",
        what_i_built: ["Azure OCR", "RAG System", "AI Smart Text", "Vector DB", "Full MERN Stack", "Third-party APIs"],
        what_i_learned: "Building Recepta made me humble. Every tool I used — from open source libraries to high-end APIs — is the result of real people with hard work and talent. I realized that in the software world, we are one as a whole, helping each other solve problems.",
        milestone: "The 'Boom!' moment: pointing a camera at a receipt and seeing Azure AI analyze prices, dates, and items into structured data faster than I could think — then watching the budget update instantly. That's when I knew full-stack development was my path.",
      },
    },
    {
      name: "Engineering Portal",
      year: "2nd Year",
      subject: "Data Structures & Algorithms",
      tags: ["React", "Node.js", "Spring Boot", "WebSocket", "MongoDB", "Charts"],
      gradient: "linear-gradient(135deg, #0d1117 0%, #161b22 40%, #0d1f3c 100%)",
      image: portalImg,
      github: "https://github.com/moi-script/engineering_portal",
      vercel: "https://engineering-portal-front.vercel.app/",
      code: CODE_SNIPPETS.portal,
      accentColor: "#7c3aed",
      quote: "I started frontend first. I suffered miserably. Now I always start with the schema.",
      journey: {
        turning_point: "If Game Trigger was my honeymoon phase, the Engineering Portal was my trial by fire. This project forced me to grow up as a developer — stepping away from AI reliance and diving deep into React and System Design at the same time.",
        the_struggle: "I built it frontend → backend → database. That was wrong. I ended up in constant, painful refactoring cycles because my frontend didn't match the data I actually needed. The multi-role system (Admin, Teacher, Student) and real-time chat made it ten times more complex.",
        what_i_built: ["Multi-role Auth", "Real-time Chat", "WebSocket", "Progress Charts", "Admin Dashboard", "DB Schema Design"],
        what_i_learned: "Always start with the schema. Schema-first design saves weeks of pain. Also: real-time data processing via WebSocket was the most satisfying technical concept I discovered here — seeing messages appear without a page refresh felt like magic.",
        milestone: "Seeing the complex database schema finally 'click' with the UI after weeks of refactoring — and submitting a system where admins, teachers, and students could all interact in real-time. Patience and consistency made this achievable.",
      },
    },
    {
      name: "Game Trigger",
      year: "1st Year",
      subject: "Object Oriented Programming",
      tags: ["HTML", "CSS", "JavaScript", "DOM", "Web Audio API", "Browser APIs"],
      gradient: "linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #11998e 100%)",
      image: triggerImg,
      github: "https://github.com/moi-script/Trigger_Game_Project",
      vercel: "https://trigger-game-project.vercel.app/",
      code: CODE_SNIPPETS.trigger,
      accentColor: "#00ff88",
      quote: "C++ taught me how computers think. JavaScript showed me code could be beautiful.",
      journey: {
        turning_point: "Coming from the rigid, low-level world of C++, the DOM felt like moving from a calculator to a canvas. Web development was completely different — high-tech, alive, and way more interesting than I expected. This project was my turning point.",
        the_struggle: "JavaScript was completely new territory. Event listeners, DOM manipulation, Browser APIs — concepts that don't exist in C++. Writing my first real-time game loop with sound effects using the Web Audio API while under deadline pressure tested my consistency hard.",
        what_i_built: ["DOM Events", "Web Audio API", "Game Loop", "CSS Animations", "Score System", "Sound Integration"],
        what_i_learned: "JavaScript is more interesting than I thought. Seeing HTML, CSS, and JS combine to make something 'lively and beautiful' — a game that responds to you with sound and motion — was the moment I understood why people love front-end development. It improved my algorithmic thinking massively.",
        milestone: "🏆 1st Place — Computer Engineering Week. Not just a certificate — it was validation that my algorithmic thinking could solve real, interactive problems under a deadline. It turned a curiosity into a passion that I still carry today.",
      },
    },
  ];

  const modules = [
    { label: "The Architect", icon: "⬡", desc: "I design scalable full-stack systems, thinking about how data flows from a MongoDB schema to a React frontend before writing a single line of UI.", color: "#00d4ff" },
    { label: "The Logic", icon: "⌘", desc: "2+ years of breaking and fixing things. My foundation spans Node.js, Express, and everything between — built through real DSA-driven projects.", color: "#7c3aed" },
    { label: "The Solver", icon: "◈", desc: "I build to remove friction. Whether it's OCR reading receipts or an AI assistant, the goal is always: make the technology work for the person efficiently , not some showy stuff.", color: "#00ff88" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#04070e",
      color: "#f1f5f9",
      fontFamily: "'DM Sans', sans-serif",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Fira+Code:wght@400;500&family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap');
        * { box-sizing: border-box; }
        @keyframes scanline {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(200px); opacity: 0; }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px) rotate(0.5deg); }
          50% { transform: translateY(-8px) rotate(-0.5deg); }
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #04070e; }
        ::-webkit-scrollbar-thumb { background: rgba(0,255,136,0.25); border-radius: 2px; }

        a { -webkit-tap-highlight-color: transparent; }
        button { -webkit-tap-highlight-color: transparent; }

        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          gap: 24px;
        }

        @media (max-width: 768px) {
          .project-grid {
            grid-template-columns: 1fr;
          }
          .nav-links { display: none !important; }
          .hero-section { padding: 100px 24px 60px !important; }
          .section-pad { padding: 60px 24px !important; }
          .about-modules { flex-direction: column !important; }
        }
      `}</style>

      {/* Background grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(0,255,136,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,136,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
        animation: "gridPulse 4s ease-in-out infinite",
      }} />

      {/* Ambient glow */}
      <div style={{
        position: "fixed", top: "-20%", right: "-10%", width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: "-10%", left: "-10%", width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Navigation */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 48px",
        height: "64px",
        background: scrolled ? "rgba(4,7,14,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
        transition: "all 0.3s",
      }}>
        <span style={{
          fontFamily: "'Fira Code', monospace",
          fontSize: "14px",
          color: "#00ff88",
          letterSpacing: "0.1em",
          fontWeight: 500,
        }}>moi.dev<span style={{ animation: "blink 1.2s infinite", marginLeft: "2px" }}>_</span></span>

        <div className="nav-links" style={{ display: "flex", gap: "36px", alignItems: "center" }}>
          {["Projects", "Journey", "About", "Contact"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              color: "#475569",
              textDecoration: "none",
              fontSize: "12px",
              fontFamily: "'Fira Code', monospace",
              letterSpacing: "0.06em",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#e2e8f0"}
            onMouseLeave={e => e.currentTarget.style.color = "#475569"}
            >{item}</a>
          ))}
          <button style={{
            padding: "8px 18px",
            background: "transparent",
            border: "1px solid rgba(0,255,136,0.35)",
            borderRadius: "6px",
            color: "#00ff88",
            fontSize: "11px",
            fontFamily: "'Fira Code', monospace",
            cursor: "pointer",
            letterSpacing: "0.08em",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,136,0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >Hire Me</button>
        </div>
      </nav>

    

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="hero-section" style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "100px 48px 60px",
        maxWidth: "1300px",
        margin: "0 auto",
        position: "relative", zIndex: 1,
        overflow: "hidden",
      }}>

        {/* Profile image — large atmospheric background on the right */}
        <div style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "55%",
          pointerEvents: "none",
          opacity: typed > 150 ? 1 : 0,
          transition: "opacity 1.2s ease",
          zIndex: 0,
        }}>
          {/* Gradient mask: fades image left→right and top→bottom */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: `
              linear-gradient(to right, #04070e 0%, #04070e 10%, rgba(4,7,14,0.7) 40%, rgba(4,7,14,0.15) 70%, rgba(4,7,14,0.05) 100%),
              linear-gradient(to bottom, #04070e 0%, transparent 12%, transparent 75%, #04070e 100%)
            `,
            zIndex: 2,
          }} />

          {/* Subtle green tint overlay to tie into the palette */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 80% 50%, rgba(0,255,136,0.04) 0%, transparent 30%)",
            zIndex: 3,
          }} />

          <img
            src={profileImg}
            alt="Moi"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
              filter: "grayscale(10%) brightness(1) contrast(1.05)",
            }}
          />
        </div>

        {/* Text content — sits above the image background */}
        <div style={{ maxWidth: "720px", position: "relative", zIndex: 1 }}>
          <TypewriterLine text="// Initializing Profile..." delay={0} typed={typed} color="#4ade80" />
          <TypewriterLine text="Hi, I'm Moi." delay={30} typed={typed} color="#f8fafc" big />
          <TypewriterLine text="Computer Engineering student building systems that optimize daily performance." delay={70} typed={typed} color="#64748b" />
          <TypewriterLine text="> Stack: MongoDB · Express · React · Typescript · Node.js · Javascript · SpringBoot · Java · Python" delay={110} typed={typed} color="#60a5fa" />
          <TypewriterLine text="> Services: Cloudinary · Tesseract.js · Scribe.js · Tavily · Vercel · Render · Azure" delay={110} typed={typed} color="#60a5fa" />
          <TypewriterLine text="> Philosophy: Always start in fundamentals" delay={170} typed={typed} color="#00ff88" />

          <div style={{
            display: "flex", gap: "12px", marginTop: "36px", flexWrap: "wrap",
            opacity: typed > 200 ? 1 : 0,
            transition: "opacity 0.9s",
          }}>
            {[
              { label: "View Projects", href: "#projects", primary: true },
              { label: "Download CV", href: "#", primary: false },
            ].map(btn => (
              <a key={btn.label} href={btn.href} style={{
                padding: "13px 30px",
                background: btn.primary ? "#00ff88" : "transparent",
                color: btn.primary ? "#04070e" : "#00ff88",
                border: "1px solid #00ff88",
                borderRadius: "8px",
                fontFamily: "'Fira Code', monospace",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.05em",
                textDecoration: "none",
                display: "inline-block",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { if (!btn.primary) e.currentTarget.style.background = "rgba(0,255,136,0.08)"; }}
              onMouseLeave={e => { if (!btn.primary) e.currentTarget.style.background = "transparent"; }}
              >{btn.label}</a>
            ))}
          </div>

          {/* Stat pills */}
          <div style={{
            display: "flex", gap: "24px", marginTop: "40px", flexWrap: "wrap",
            opacity: typed > 210 ? 1 : 0,
            transition: "opacity 0.5s 0.2s",
          }}>
            {["3+ yrs Node.js", "MERN Stack", "AI / RAG / OCR", "CompEng Student"].map(tag => (
              <span key={tag} style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: "10px",
                color: "#737b85",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOURNEY TIMELINE ─────────────────────────────────────────────────── */}
      <section id="journey" className="section-pad" style={{
        padding: "80px 48px",
        maxWidth: "1300px",
        margin: "0 auto",
        position: "relative", zIndex: 1,
      }}>
        <p style={{
          margin: "0 0 8px",
          fontFamily: "'Fira Code', monospace",
          fontSize: "11px",
          color: "#00ff88",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}>// From C++ to Software dev</p>
        <h2 style={{
          margin: "0 0 52px",
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(26px, 4vw, 44px)",
          fontWeight: 900,
          color: "#f1f5f9",
          letterSpacing: "-0.02em",
        }}>The Builder's Timeline.</h2>

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute", left: "16px", top: "8px", bottom: "8px",
            width: "1px",
            background: "linear-gradient(to bottom, #00ff88, #7c3aed, #00d4ff)",
            opacity: 0.3,
          }} />

          {[
            {
              year: "Before College", label: "The Foundation", color: "#64748b",
              detail: "C++ was my first language. Low-level, rigid, disciplined. It taught me how computers actually think — memory, pointers, logic. A tough but necessary foundation.",
              // icon: "⚙️",
            },
            {
              year: "1st Year", label: "The Turning Point", color: "#00ff88",
              detail: "Game Trigger was built with HTML, CSS, and JavaScript in my OOP subject. Moving from C++ to the DOM felt like moving from a calculator to a canvas. Won 1st place in CompEng Week. Passion ignited.",
              // icon: "🎯",
            },
            {
              year: "2nd Year", label: "The Reality Check", color: "#7c3aed",
              detail: "Engineering Portal for DSA class. Built a multi-role system with real-time chat and data visualization. Learned the hard lesson: always design the database schema first. Patience was tested. Character was built.",
              // icon: "🧱",
            },
            {
              year: "Now", label: "The Vision", color: "#00d4ff",
              detail: "Recepta — my first SaaS attempt. Azure OCR, RAG, AI text detection, full MERN stack. The project that made me realize the beauty of open source and software as a global collaboration. Self-efficacy reached a new high.",
              // icon: "🚀",
            },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: "28px",
              marginBottom: "40px",
              paddingLeft: "8px",
            }}>
              {/* Dot */}
              <div style={{
                width: "18px", height: "18px",
                borderRadius: "50%",
                background: item.color,
                border: `3px solid ${item.color}33`,
                flexShrink: 0,
                marginTop: "2px",
                boxShadow: `0 0 14px ${item.color}55`,
                zIndex: 1,
              }} />

              <div style={{
                flex: 1,
                padding: "20px 24px",
                background: "rgba(255,255,255,0.02)",
                border: `1px solid rgba(255,255,255,0.05)`,
                borderRadius: "12px",
                transition: "all 0.3s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${item.color}33`;
                e.currentTarget.style.background = `${item.color}05`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  {/* <span style={{ fontSize: "18px" }}></span> item.icon */}
                  <span style={{
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "10px",
                    color: item.color,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}>{item.year}</span>
                  <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
                  <span style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#e2e8f0",
                  }}>{item.label}</span>
                </div>
                <p style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "#4a5568",
                  lineHeight: 1.7,
                  fontFamily: "'DM Sans', sans-serif",
                }}>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ─────────────────────────────────────────────────────────── */}
      <section id="projects" className="section-pad" style={{
        padding: "80px 48px",
        maxWidth: "1300px",
        margin: "0 auto",
        position: "relative", zIndex: 1,
      }}>
        <p style={{
          margin: "0 0 8px",
          fontFamily: "'Fira Code', monospace",
          fontSize: "11px",
          color: "#00ff88",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}>// Live Deployments</p>
        <h2 style={{
          margin: "0 0 8px",
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(26px, 4vw, 44px)",
          fontWeight: 900,
          color: "#f1f5f9",
          letterSpacing: "-0.02em",
        }}>Projects shipped to prod.</h2>
        <p style={{
          margin: "0 0 44px",
          color: "#334155",
          fontSize: "13px",
          fontFamily: "'Fira Code', monospace",
        }}>
          Click <span style={{ color: "#00ff88" }}>// BUILDER JOURNEY</span> on any card to read the real story behind each project.
          Hit <span style={{ color: "#00d4ff" }}>CODE</span> to X-ray the source.
        </p>

        <div className="project-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.name} index={index} project={project} />
          ))}
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────────────────── */}
      <section id="about" className="section-pad" style={{
        padding: "80px 48px",
        maxWidth: "1300px",
        margin: "0 auto",
        position: "relative", zIndex: 1,
      }}>
        <div style={{
          background: "rgba(8,12,22,0.7)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "24px",
          padding: "52px",
          backdropFilter: "blur(10px)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Header */}
          <p style={{
            margin: "0 0 8px",
            fontFamily: "'Fira Code', monospace",
            fontSize: "11px",
            color: "#7c3aed",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}>// About the Developer</p>
          <h2 style={{
            margin: "0 0 18px",
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(24px, 3.5vw, 42px)",
            fontWeight: 900,
            color: "#f1f5f9",
            letterSpacing: "-0.02em",
          }}>Architecting Logic.<br />Solving Systems.</h2>
          <p style={{
            margin: "0 0 44px",
            color: "#4a5568",
            fontSize: "15px",
            lineHeight: 1.75,
            maxWidth: "640px",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Computer Engineering student from National College of Science and Technology,  who views software through the lens of an engineer.
            With a foundation in Node.js and a passion for AI-driven automation, I specialize in building <em style={{ color: "#7c3aed", fontStyle: "normal" }}>smart systems</em> — from full-stack budget trackers with OCR to real-time learning portals.
            I believe we're all part of a larger ecosystem, helping each other solve problems.
          </p>

          {/* Modules */}
          <div className="about-modules" style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "32px" }}>
            {modules.map((mod, i) => (
              <AboutModule
                key={mod.label}
                {...mod}
                active={activeModule === i}
                onHover={() => setActiveModule(i)}
              />
            ))}
          </div>

          {/* Terminal block */}
          <div style={{
            padding: "22px 26px",
            background: "rgba(0,255,136,0.02)",
            border: "1px solid rgba(0,255,136,0.08)",
            borderRadius: "12px",
            fontFamily: "'Fira Code', monospace",
            fontSize: "12px",
            lineHeight: 2,
          }}>
            <div><span style={{ color: "#1e293b" }}>$ </span><span style={{ color: "#4ade80" }}>node analyze.js --mode deep</span></div>
            <div><span style={{ color: "#1e293b" }}>→ </span><span style={{ color: "#475569" }}>Experience: </span><span style={{ color: "#60a5fa" }}>3+ years</span><span style={{ color: "#475569" }}> Node.js · React · Javascript</span></div>
            <div><span style={{ color: "#1e293b" }}>→ </span><span style={{ color: "#475569" }}>Currently: </span><span style={{ color: "#60a5fa" }}>Computer Engineering</span><span style={{ color: "#475569" }}> Project · AI + OCR + IOT</span></div>
            <div><span style={{ color: "#1e293b" }}>→ </span><span style={{ color: "#475569" }}>Mindset: </span><span style={{ color: "#00ff88" }}>"Consistency is everything. Humility is the edge."</span></div>
            <div><span style={{ color: "#1e293b" }}>→ </span><span style={{ color: "#475569" }}>Status: </span><span style={{ color: "#4ade80" }}>◉ Open to internships & freelance</span></div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────────────────── */}
      <section id="contact" className="section-pad" style={{
        padding: "80px 48px 120px",
        maxWidth: "1300px",
        margin: "0 auto",
        position: "relative", zIndex: 1,
        textAlign: "center",
      }}>
        <p style={{
          margin: "0 0 8px",
          fontFamily: "'Fira Code', monospace",
          fontSize: "11px",
          color: "#00ff88",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}>// Let's Build Together</p>
        <h2 style={{
          margin: "0 0 16px",
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(28px, 4.5vw, 56px)",
          fontWeight: 900,
          color: "#f1f5f9",
          letterSpacing: "-0.03em",
        }}>Got a system<br />to build?</h2>
        <p style={{
          margin: "0 auto 48px",
          color: "#334155",
          fontSize: "15px",
          maxWidth: "480px",
          lineHeight: 1.65,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Open to internships, freelance projects, and anything that needs a fresh engineer's perspective.
        </p>

        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "nugalmoises62@gmail.com", icon: "◎", href: "mailto:nugalmoises62@gmail.com" },
            { label: "github.com/moi-script", icon: "⌥", href: "https://github.com/moi-script" },
            { label: "linkedin.com/in/moi", icon: "⊞", href: "https://www.linkedin.com/in/moises-nugal-1b06833b1" },
          ].map(link => (
            <a key={link.label} href={link.href} style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "13px 24px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "10px",
              color: "#475569",
              fontSize: "12px",
              fontFamily: "'Fira Code', monospace",
              textDecoration: "none",
              letterSpacing: "0.04em",
              transition: "all 0.25s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "rgba(0,255,136,0.3)";
              e.currentTarget.style.color = "#00ff88";
              e.currentTarget.style.background = "rgba(0,255,136,0.04)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
              e.currentTarget.style.color = "#475569";
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
            }}
            >
              <span style={{ fontSize: "14px" }}>{link.icon}</span>
              {link.label}
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.04)",
        padding: "24px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative", zIndex: 1,
      }}>
        <span style={{
          fontFamily: "'Fira Code', monospace",
          fontSize: "10px",
          color: "#1e293b",
          letterSpacing: "0.06em",
        }}>Built by Moi · 2026 · Cavite, PH 🇵🇭</span>
        <span style={{
          fontFamily: "'Fira Code', monospace",
          fontSize: "10px",
          color: "#1e293b",
        }}> <span style={{ color: "#22c55e" }}>●</span></span>
      </footer>
    </div>
  );
}