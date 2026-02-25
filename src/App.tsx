import React, { useState, useEffect } from "react";

// ─── Interfaces & Types ─────────────────────────────────────────────────────
import receptaImg from './assets/recepta.png';
import triggerImg from './assets/trigger_game.png';
import portalImg from './assets/engr_portal.png'

interface Project {
  name: string;
  description: string;
  tags: string[];
  gradient: string;
  imageLabel: string;
  image?: string;
  github: string;
  vercel: string;
  code: string;
  imageAlt?: string;
}

interface Module {
  label: string;
  icon: string;
  desc: string;
}

interface ProjectImageProps {
  gradient: string;
  label: string;
  image?: string;
}

interface XRayOverlayProps {
  code: string;
  visible: boolean;
}

interface XRayButtonProps {
  active: boolean;
  onClick: () => void;
}

interface XRayCardProps {
  children: React.ReactNode;
  code: string;
  style?: React.CSSProperties;
}

interface AboutModuleProps extends Module {
  active: boolean;
  onHover: () => void;
}

interface ProjectCardProps {
  project: Project;
  index : number
}

// ─── Code Snippets for X-Ray Mode ───────────────────────────────────────────
const CODE_SNIPPETS: Record<string, string> = {
  hero: `// Hero.jsx — System Architect Profile Init
const [status, setStatus] = useState('online');
const stack = ['MongoDB','Express','React','Node','Python','Lua'];

useEffect(() => {
  initTerminalSequence();
  loadSystemProfile({ name: 'Moi', role: 'Full Stack Developer' });
}, []);

return <HeroSection animate={true} stack={stack} />;`,

  about: `# about_moi.py — Logic Engine
class SystemArchitect:
    def __init__(self):
        self.name = "Moi"
        self.stack = ["MERN", "Python", "Lua"]
        self.years_exp = 2
        self.mindset = "If it's repetitive, it's a bug"

    def solve(self, problem):
        analysis = self.analyze(problem)
        logic = self.engineer(analysis)
        return self.automate(logic)`,

  projects: `// ProjectGrid.jsx — Live Deployments
const projects = useProjectStore();
const { data } = useSWR('/api/vercel/deployments');

return projects.map(p => (
  <ProjectCard
    key={p.id}
    live={p.vercelUrl}
    stack={p.tech}
    onXRay={() => showCodeLayer(p)}
  />
));`,

  budgetTracker: `// BudgetTracker — MERN Stack
// MongoDB schema for transactions
const TransactionSchema = new Schema({
  amount: { type: Number, required: true },
  category: String,
  date: { type: Date, default: Date.now }
});

// React state management
const [balance, setBalance] = useState(0);
const updateBalance = async (tx) => {
  const res = await axios.post('/api/tx', tx);
  setBalance(prev => prev + res.data.amount);
};`,

  friday: `#  Engineering Portal — Connect with students

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProcessedMessageService {

    private final ProcessedMessageRepository processedMessageRepository;
    private final MessagesListRepository messagesListRepository;

    @Autowired
    public ProcessedMessageService(ProcessedMessageRepository processedMessageRepository,
                                   MessagesListRepository messagesListRepository) {
        this.processedMessageRepository = processedMessageRepository;
        this.messagesListRepository = messagesListRepository;
    } 
  `,

  robloxPlugin: `-- Js

window.addEventListener('load', function () {
    let db = null;
    let dbRequest = indexedDB.open('leaderBoards', 7);

    dbRequest.onsuccess = function (event) {
        db = event.target.result;
        console.log('This is the data base', db)
        // trying to turn this off if there is not player here
        
          getAllItemsSortedByScore(function (sortedItems) {
            console.log('Sorted items by score:', sortedItems);
            updateSortedItems(sortedItems);
        });
        
      
    };
  `,
};

// ─── Placeholder images using gradient divs ──────────────────────────────────
const ProjectImage: React.FC<ProjectImageProps> = ({ gradient, label, image }) => (
  <div style={{
    width: "100%",
    height: "180px",
    background: gradient, // Fallback if image fails to load
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  }}>
    {/* If image exists, render it with object-fit cover */}
    {image && (
      <img 
        src={image} 
        alt={label}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover", // Ensures image fills the box without stretching
          zIndex: 1,
          opacity: 0.9 // Slight transparency to blend with theme
        }} 
      />
    )}

    {/* Dark Overlay so text is readable on top of image */}
    <div style={{
      position: "absolute", inset: 0,
      background: image 
        ? "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))" // Darker at bottom for text
        : "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px)",
      zIndex: 2
    }} />

    {/* Label Text */}
    <span style={{ 
      color: "rgba(255,255,255,0.9)", 
      fontSize: "13px", 
      fontFamily: "'JetBrains Mono', monospace", 
      letterSpacing: "0.1em",
      zIndex: 3,
      position: "relative",
      textShadow: "0 2px 4px rgba(0,0,0,0.8)" // Shadow for readability
    }}>
      {label}
    </span>
  </div>
);

// ─── X-Ray Code Overlay ───────────────────────────────────────────────────────
const XRayOverlay: React.FC<XRayOverlayProps> = ({ code, visible }) => (
  <div style={{
    position: "absolute", inset: 0,
    background: "rgba(6, 10, 18, 0.92)",
    backdropFilter: "blur(2px)",
    borderRadius: "inherit",
    padding: "20px",
    opacity: visible ? 1 : 0,
    transition: "opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    pointerEvents: visible ? "all" : "none",
    zIndex: 10,
    overflow: "hidden",
    border: "1px solid rgba(0, 255, 136, 0.2)",
  }}>
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: "1px",
      background: "linear-gradient(90deg, transparent, #00ff88, transparent)",
      animation: visible ? "scanline 2s infinite" : "none",
    }} />
    <pre style={{
      margin: 0,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      fontSize: "11.5px",
      lineHeight: "1.7",
      color: "#7dd3fc",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    }}>
      <span style={{ color: "#6ee7b7" }}>
        {code.split('\n').map((line, i) => (
          <span key={i} style={{ display: "block" }}>
            <span style={{ color: "rgba(255,255,255,0.2)", userSelect: "none", marginRight: "16px", minWidth: "24px", display: "inline-block", textAlign: "right" }}>
              {i + 1}
            </span>
            {line.startsWith('  ') || line.startsWith('\t') ? (
              <span style={{ color: "#94a3b8" }}>{line}</span>
            ) : line.includes('//') || line.startsWith('#') || line.startsWith('--') ? (
              <span style={{ color: "#4ade80", fontStyle: "italic" }}>{line}</span>
            ) : line.match(/\b(const|let|var|function|class|def|local)\b/) ? (
              <span>
                {line.split(/\b(const|let|var|function|class|def|local|return|import|export|from|if|else|for|new)\b/).map((part, pi) =>
                  ['const','let','var','function','class','def','local','return','import','export','from','if','else','for','new'].includes(part)
                    ? <span key={pi} style={{ color: "#c084fc" }}>{part}</span>
                    : <span key={pi} style={{ color: "#e2e8f0" }}>{part}</span>
                )}
              </span>
            ) : (
              <span style={{ color: "#cbd5e1" }}>{line}</span>
            )}
          </span>
        ))}
      </span>
    </pre>
  </div>
);

// ─── XRay Button ─────────────────────────────────────────────────────────────
const XRayButton: React.FC<XRayButtonProps> = ({ active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: "6px",
      padding: "6px 14px",
      background: active ? "rgba(0, 255, 136, 0.15)" : "rgba(255,255,255,0.05)",
      border: `1px solid ${active ? "rgba(0,255,136,0.5)" : "rgba(255,255,255,0.1)"}`,
      borderRadius: "6px",
      color: active ? "#00ff88" : "rgba(255,255,255,0.5)",
      fontSize: "11px",
      fontFamily: "'JetBrains Mono', monospace",
      cursor: "pointer",
      transition: "all 0.2s",
      letterSpacing: "0.05em",
    }}
  >
    <span style={{ fontSize: "13px" }}>{active ? "◉" : "○"}</span>
    {active ? "X-RAY ON" : "CODE VIEW"}
  </button>
);

// ─── Section Card (with X-Ray) ────────────────────────────────────────────────
const XRayCard: React.FC<XRayCardProps> = ({ children, code, style = {} }) => {
  const [xray, setXray] = useState(false);

  return (
    <div style={{
      position: "relative",
      borderRadius: "16px",
      overflow: "hidden",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      transition: "all 0.3s",
      ...style,
    }}>
      <div style={{
        opacity: xray ? 0.15 : 1,
        transition: "opacity 0.35s",
        filter: xray ? "blur(1px)" : "none",
      }}>
        {children}
      </div>
      <XRayOverlay code={code} visible={xray} />
      <div style={{
        position: "absolute", top: "14px", right: "14px", zIndex: 20,
      }}>
        <XRayButton active={xray} onClick={() => setXray(v => !v)} />
      </div>
    </div>
  );
};

// ─── Terminal Hero ────────────────────────────────────────────────────────────
const TerminalHero: React.FC = () => {
  const [typed, setTyped] = useState(0);
  const lines = [
    { text: "// Initializing System Architect Profile...", color: "#4ade80", delay: 0 },
    { text: "Hi, I'm Moi.", color: "#f8fafc", delay: 40, big: true },
    { text: "I bridge high-level web apps and low-level system control.", color: "#94a3b8", delay: 80 },
    { text: "> Stack: MongoDB · Express · React · Node · Python · Lua", color: "#60a5fa", delay: 120 },
    { text: "> Mission: If it's repetitive, it's a bug.", color: "#00ff88", delay: 160 },
  ];

  useEffect(() => {
    const timer = setInterval(() => setTyped(p => Math.min(p + 1, 200)), 18);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: "60px 40px 50px", position: "relative" }}>
      {lines.map((line, i) => (
        <div key={i} style={{
          opacity: typed > line.delay ? 1 : 0,
          transform: typed > line.delay ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.4s ease",
          marginBottom: line.big ? "16px" : "10px",
        }}>
          {line.big ? (
            <h1 style={{
              margin: 0,
              fontSize: "clamp(36px, 5vw, 64px)",
              fontFamily: "'Syne', 'Space Grotesk', sans-serif",
              fontWeight: 800,
              color: line.color,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}>{line.text}</h1>
          ) : (
            <p style={{
              margin: 0,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(12px, 1.4vw, 14px)",
              color: line.color,
              lineHeight: 1.6,
            }}>{line.text}</p>
          )}
        </div>
      ))}

      <div style={{
        display: "flex", gap: "12px", marginTop: "32px", flexWrap: "wrap",
        opacity: typed > 180 ? 1 : 0,
        transition: "opacity 0.5s 0.2s",
      }}>
        {["View Projects", "Download CV"].map((label, i) => (
          <button key={label} style={{
            padding: "12px 28px",
            background: i === 0 ? "#00ff88" : "transparent",
            color: i === 0 ? "#060a12" : "#00ff88",
            border: "1px solid #00ff88",
            borderRadius: "8px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.05em",
            transition: "all 0.2s",
          }}>{label}</button>
        ))}
      </div>
    </div>
  );
};

// ─── Project Card ─────────────────────────────────────────────────────────────
const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [xray, setXray] = useState(false);

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "16px",
      overflow: "hidden",
      transition: "transform 0.3s, border-color 0.3s",
      position: "relative",
    }}
    onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(0,255,136,0.25)"}
    onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
    >
      <div style={{ position: "relative" }}>
        <div style={{
          opacity: xray ? 0.1 : 1,
          transition: "opacity 0.35s",
          filter: xray ? "blur(1px)" : "none",
        }}>
          <ProjectImage gradient={project.gradient} label={project.imageLabel} 
          image={project.image}
          />

        </div>
        <XRayOverlay code={project.code} visible={xray} />
        <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 20 }}>
          <XRayButton active={xray} onClick={() => setXray(v => !v)} />
        </div>
        <div style={{
          position: "absolute", bottom: "12px", left: "12px",
          display: "flex", gap: "6px", flexWrap: "wrap",
          zIndex: 5,
          opacity: xray ? 0 : 1,
          transition: "opacity 0.3s",
        }}>
          {project.tags.map(tag => (
            <span key={tag} style={{
              background: "rgba(6,10,18,0.85)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#94a3b8",
              fontSize: "10px",
              padding: "3px 8px",
              borderRadius: "4px",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.05em",
            }}>{tag}</span>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 24px 24px" }}>
        <h3 style={{
          margin: "0 0 8px",
          fontSize: "18px",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          color: "#f1f5f9",
          letterSpacing: "-0.01em",
        }}>{project.name}</h3>
        <p style={{
          margin: "0 0 20px",
          fontSize: "13.5px",
          color: "#64748b",
          lineHeight: 1.65,
          fontFamily: "'DM Sans', sans-serif",
        }}>{project.description}</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <a href={project.vercel} target="_blank" rel="noreferrer" style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "8px 16px",
            background: "rgba(0,255,136,0.08)",
            border: "1px solid rgba(0,255,136,0.25)",
            borderRadius: "7px",
            color: "#00ff88",
            fontSize: "12px",
            fontFamily: "'JetBrains Mono', monospace",
            textDecoration: "none",
            letterSpacing: "0.05em",
            transition: "all 0.2s",
          }}>
            ▲ Live Demo
          </a>
          <a href={project.github} 
              target="_blank"       // <--- Recommended: Opens in new tab
            rel="noreferrer"      
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "8px 16px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "7px",
            color: "#94a3b8",
            fontSize: "12px",
            fontFamily: "'JetBrains Mono', monospace",
            textDecoration: "none",
            letterSpacing: "0.05em",
          }}>
            ⌥ GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

// ─── About Modules ────────────────────────────────────────────────────────────
const AboutModule: React.FC<AboutModuleProps> = ({ label, icon, desc, active, onHover }) => (
  <div
    onMouseEnter={onHover}
    style={{
      padding: "28px",
      background: active ? "rgba(0,255,136,0.04)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${active ? "rgba(0,255,136,0.3)" : "rgba(255,255,255,0.06)"}`,
      borderRadius: "12px",
      cursor: "default",
      transition: "all 0.3s",
      flex: 1,
      minWidth: "200px",
    }}
  >
    <div style={{
      fontSize: "24px", marginBottom: "12px",
      filter: active ? "drop-shadow(0 0 8px #00ff88)" : "none",
      transition: "filter 0.3s",
    }}>{icon}</div>
    <h4 style={{
      margin: "0 0 8px",
      fontFamily: "'Syne', sans-serif",
      fontSize: "15px",
      fontWeight: 700,
      color: active ? "#00ff88" : "#e2e8f0",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    }}>{label}</h4>
    <p style={{
      margin: 0,
      fontSize: "13px",
      color: "#64748b",
      lineHeight: 1.6,
      fontFamily: "'DM Sans', sans-serif",
    }}>{desc}</p>
  </div>
);

// ─── Main Portfolio ───────────────────────────────────────────────────────────
export default function MoiPortfolio() {
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

const projects: Project[] = [
    {
      name: "Recepta",
      description: "Full-stack MERN application for personal finance tracking with real-time balance updates powered by AI .",
      tags: ["MongoDB", "Express", "React", "Node.js", "Azure Services", "Openrouter"],
      gradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
      image: receptaImg, // <--- YOUR IMAGE HERE
      imageLabel: "recepta.app",
      github : "https://github.com/moi-script/YourCeipt",
      vercel: "https://recepta-phi.vercel.app/",
      code: CODE_SNIPPETS.budgetTracker,
    },
    {
      name: "Engineering Portal",
      description: "Allows admin to communicate with enrolled users also upload tasks.",
      tags: ["Nodejs", "Springboot", "React"],
      gradient: "linear-gradient(135deg, #0d1117 0%, #161b22 40%, #0d1f3c 100%)",
      image: portalImg, // <--- Using 'engr_portal' here (fits the System Architect theme)
      imageLabel: "learning platform",
      github : "https://github.com/moi-script/engineering_portal", 
      vercel: "https://engineering-portal-front.vercel.app/",
      code: CODE_SNIPPETS.friday,
    },
    {
      name: "Game Trigger",
      description: "An engineering games that will challenge and pressure you.",
      tags: ["JS", "CSS", "HTML"],
      gradient: "linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #11998e 100%)",
      image: triggerImg, // <--- Using 'trigger_game' here
      github : "https://github.com/moi-script/Trigger_Game_Project",
      imageLabel: "engineering game to challenge",
      vercel: "https://trigger-game-project.vercel.app/",
      code: CODE_SNIPPETS.robloxPlugin,
    },
  ];  

  const modules: Module[] = [
    { label: "The Architect", icon: "⬡", desc: "I design scalable full-stack environments, focusing on how data flows from a MongoDB cluster to a Vite + React frontend." },
    { label: "The Logic", icon: "⌘", desc: "Clean, executable code built on 2 years of breaking and fixing things. My foundation spans Node.js, Python, and everything in between." },
    { label: "The Solver", icon: "◈", desc: "I build to remove friction. Whether it's a Roblox plugin or an AI api and assistant, tools should work for the user — not the other way around." },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060a12",
      color: "#f1f5f9",
      fontFamily: "'DM Sans', sans-serif",
      overflowX: "hidden",
    }}>
      {/* Google Fonts & Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@400;500&display=swap');

        * { box-sizing: border-box; }

        @keyframes scanline {
          0% { transform: translateY(0); opacity: 0.8; }
          50% { opacity: 0.3; }
          100% { transform: translateY(180px); opacity: 0; }
        }

        @keyframes pulse-border {
          0%, 100% { border-color: rgba(0,255,136,0.2); }
          50% { border-color: rgba(0,255,136,0.6); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #060a12; }
        ::-webkit-scrollbar-thumb { background: rgba(0,255,136,0.3); border-radius: 2px; }
      `}</style>

      {/* Navigation */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 40px",
        height: "64px",
        background: scrolled ? "rgba(6,10,18,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s",
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "14px",
          color: "#00ff88",
          letterSpacing: "0.1em",
          fontWeight: 500,
        }}>moi.dev</span>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {["Projects", "About", "Contact"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              color: "#64748b",
              textDecoration: "none",
              fontSize: "13px",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.05em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#f1f5f9"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}
            >{item}</a>
          ))}
          <button style={{
            padding: "7px 16px",
            background: "transparent",
            border: "1px solid rgba(0,255,136,0.4)",
            borderRadius: "6px",
            color: "#00ff88",
            fontSize: "11px",
            fontFamily: "'JetBrains Mono', monospace",
            cursor: "pointer",
            letterSpacing: "0.08em",
          }}>Hire Me</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "80px 40px 40px",
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative",
      }}>
        {/* Background grid */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }} />

        <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
          <XRayCard code={CODE_SNIPPETS.hero} style={{ maxWidth: "680px" }}>
            <TerminalHero />
          </XRayCard>

          <div style={{
            display: "flex", gap: "32px", marginTop: "32px",
            opacity: 0.7,
          }}>
            {["2+ yrs Node.js", "MERN Stack", "AI Automation", "Computer Eng"].map(tag => (
              <span key={tag} style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                color: "#475569",
                letterSpacing: "0.08em",
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Floating status card (Placeholder) */}
        <div style={{
          position: "absolute", right: "0", top: "50%",
          transform: "translateY(-50%)",
          animation: "float 3s ease-in-out infinite",
          display: "none",
        }} className="status-card">
        </div>
      </section>

      {/* Projects */}
      <section id="projects" style={{
        padding: "80px 40px",
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ marginBottom: "48px" }}>
          <p style={{
            margin: "0 0 8px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            color: "#00ff88",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}>// Live Deployments</p>
          <h2 style={{
            margin: 0,
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 800,
            color: "#f1f5f9",
            letterSpacing: "-0.02em",
          }}>Projects shipped to prod.</h2>
          <p style={{
            margin: "12px 0 0",
            color: "#475569",
            fontSize: "14px",
            fontFamily: "'DM Sans', sans-serif",
          }}>Hit <span style={{ color: "#00ff88", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>CODE VIEW</span> on any project to X-ray the source logic.</p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "24px",
        }}>
          {projects.map((project, index) => (
            <ProjectCard key={project.name} index={index} project={project} />
          ))}
        </div>
      </section>




      {/* About */}
      <section id="about" style={{
        padding: "80px 40px",
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative", zIndex: 1,
      }}>
        <XRayCard code={CODE_SNIPPETS.about} style={{ padding: "48px" }}>
          <div>
            <p style={{
              margin: "0 0 8px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              color: "#00ff88",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}>// About the Developer</p>
            <h2 style={{
              margin: "0 0 16px",
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(26px, 3.5vw, 40px)",
              fontWeight: 800,
              color: "#f1f5f9",
              letterSpacing: "-0.02em",
            }}>Architecting Logic. Solving Systems.</h2>
            <p style={{
              margin: "0 0 40px",
              color: "#64748b",
              fontSize: "15px",
              lineHeight: 1.7,
              maxWidth: "600px",
            }}>
              Computer Engineering student who views software through the lens of an engineer. With a foundation in Node.js and a passion for AI-driven automation, I specialize in building <em style={{ color: "#94a3b8" }}>"smart" systems</em> — from full-stack budget trackers to local AI assistants.
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {modules.map((mod, i) => (
                <AboutModule
                  key={mod.label}
                  {...mod}
                  active={activeModule === i}
                  onHover={() => setActiveModule(i)}
                />
              ))}
            </div>

            {/* Circuit connection lines */}
            <div style={{
              marginTop: "32px",
              padding: "20px 24px",
              background: "rgba(0,255,136,0.03)",
              border: "1px solid rgba(0,255,136,0.1)",
              borderRadius: "10px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              color: "#4ade80",
              lineHeight: 1.8,
            }}>
              <span style={{ color: "#475569" }}>$ </span>node analyze.js --mode deep<br />
              <span style={{ color: "#475569" }}>→ </span>Experience: <span style={{ color: "#60a5fa" }}>2+ years</span> Node.js<br />
              <span style={{ color: "#475569" }}>→ </span>Currently: <span style={{ color: "#60a5fa" }}>Computer Engineering</span> student<br />
              <span style={{ color: "#475569" }}>→ </span>Philosophy: <span style={{ color: "#00ff88" }}>"If it's repetitive, it's a bug."</span>
            </div>
          </div>
        </XRayCard>
      </section>

      {/* Contact */}
      <section id="contact" style={{
        padding: "80px 40px 100px",
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative", zIndex: 1,
        textAlign: "center",
      }}>
        <p style={{
          margin: "0 0 8px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "12px",
          color: "#00ff88",
          letterSpacing: "0.15em",
        }}>// Let's Build</p>
        <h2 style={{
          margin: "0 0 16px",
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(30px, 4vw, 52px)",
          fontWeight: 800,
          color: "#f1f5f9",
          letterSpacing: "-0.02em",
        }}>Got a system to architect?</h2>
        <p style={{
          margin: "0 auto 40px",
          color: "#475569",
          fontSize: "15px",
          maxWidth: "480px",
          lineHeight: 1.6,
        }}>Open to internships, freelance projects, and anything that needs a fresh engineer's perspective.</p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "moi@email.com", icon: "◎" },
            { label: "github.com/moi", icon: "⌥" },
            { label: "linkedin.com/in/moi", icon: "⊞" },
          ].map(link => (
            <a key={link.label} href="#" style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "12px 24px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              color: "#64748b",
              fontSize: "13px",
              fontFamily: "'JetBrains Mono', monospace",
              textDecoration: "none",
              letterSpacing: "0.03em",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,255,136,0.3)"; e.currentTarget.style.color = "#00ff88"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#64748b"; }}
            >
              <span>{link.icon}</span> {link.label}
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "24px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative", zIndex: 1,
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          color: "#1e293b",
          letterSpacing: "0.05em",
        }}>Built by Moi · 2026</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          color: "#1e293b",
        }}>All systems operational <span style={{ color: "#22c55e" }}>●</span></span>
      </footer>
    </div>
  );
}