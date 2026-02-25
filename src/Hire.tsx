import React, { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  role: "assistant" | "user";
  content: string;
  timestamp: string;
}

interface HireMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCENT = "#00ff88";
const ACCENT_BLUE = "#00d4ff";
const ACCENT_PURPLE = "#7c3aed";

const QUESTIONS = [
  "Hey! I'm Friday — Moi's AI hiring assistant. 👋\n\nBefore I connect you with Moi, let me ask a few quick questions so he's fully prepared.\n\nFirst: **What's your name and company / organization?**",
  "Nice to meet you! 🤝\n\n**What kind of opportunity are you reaching out about?**\n\n_(e.g. internship, freelance project, full-time role, collaboration)_",
  "Interesting! Last one:\n\n**Briefly describe the project or role — what problem are you trying to solve?**\n\n_(Even a sentence or two is perfect.)_",
];

const FINAL_MESSAGE = (name: string, type: string, project: string) =>
  `Got it! Here's a summary of what I'm sending Moi:\n\n` +
  `**From:** ${name}\n` +
  `**Opportunity:** ${type}\n` +
  `**About:** ${project}\n\n` +
  `Moi will be notified at **nugalmoises62@gmail.com** — he typically responds within 24hrs. 🚀\n\n` +
  `_You can also reach him directly via the links below._`;

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────
const TypingIndicator: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "12px 16px" }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: ACCENT,
          animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          opacity: 0.7,
        }}
      />
    ))}
  </div>
);

// ─── Message Bubble ───────────────────────────────────────────────────────────
const MessageBubble: React.FC<{ msg: Message }> = ({ msg }) => {
  const isAssistant = msg.role === "assistant";

  // Parse **bold** markdown
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} style={{ color: isAssistant ? ACCENT : "#f1f5f9", fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("_") && part.endsWith("_")) {
        return <em key={i} style={{ color: "#475569", fontStyle: "italic" }}>{part.slice(1, -1)}</em>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: isAssistant ? "row" : "row-reverse",
      gap: "10px",
      marginBottom: "16px",
      alignItems: "flex-end",
    }}>
      {/* Avatar */}
      {isAssistant && (
        <div style={{
          width: "32px", height: "32px",
          borderRadius: "8px",
          background: `linear-gradient(135deg, ${ACCENT}22, ${ACCENT_BLUE}22)`,
          border: `1px solid ${ACCENT}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px",
          flexShrink: 0,
        }}>◈</div>
      )}

      <div style={{
        maxWidth: "78%",
        padding: "12px 16px",
        borderRadius: isAssistant ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
        background: isAssistant
          ? "rgba(0,255,136,0.05)"
          : "rgba(0,212,255,0.08)",
        border: isAssistant
          ? `1px solid rgba(0,255,136,0.12)`
          : `1px solid rgba(0,212,255,0.15)`,
        position: "relative",
      }}>
        <p style={{
          margin: 0,
          fontSize: "13px",
          color: isAssistant ? "#94a3b8" : "#cbd5e1",
          lineHeight: 1.7,
          fontFamily: "'DM Sans', sans-serif",
          whiteSpace: "pre-line",
        }}>
          {renderContent(msg.content)}
        </p>
        <span style={{
          display: "block",
          marginTop: "6px",
          fontSize: "9px",
          color: "#1e293b",
          fontFamily: "'Fira Code', monospace",
          textAlign: isAssistant ? "left" : "right",
        }}>{msg.timestamp}</span>
      </div>
    </div>
  );
};

// ─── Main Modal ───────────────────────────────────────────────────────────────
export const HireMeModal: React.FC<HireMeModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Init on open
  useEffect(() => {
    if (!isOpen) return;
    setMessages([]);
    setStep(0);
    setAnswers([]);
    setIsDone(false);
    setIsMinimized(false);
    setDragPos({ x: 0, y: 0 });

    // Show first message after a short delay
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages([{ role: "assistant", content: QUESTIONS[0], timestamp: getTime() }]);
      }, 1200);
    }, 300);
  }, [isOpen]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input
  useEffect(() => {
    if (!isTyping && isOpen && !isDone) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isTyping, isOpen, isDone]);

  const handleSend = () => {
    if (!input.trim() || isTyping || isDone) return;

    const userMsg: Message = { role: "user", content: input.trim(), timestamp: getTime() };
    const newAnswers = [...answers, input.trim()];
    setAnswers(newAnswers);
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const nextStep = step + 1;
    setStep(nextStep);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (nextStep < QUESTIONS.length) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: QUESTIONS[nextStep], timestamp: getTime() },
        ]);
      } else {
        // Final summary
        const [name, type, project] = newAnswers;
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: FINAL_MESSAGE(name || "—", type || "—", project || "—"), timestamp: getTime() },
        ]);
        setIsDone(true);

        // Trigger mailto
        const subject = encodeURIComponent(`[Friday AI] Hire Inquiry from ${name}`);
        const body = encodeURIComponent(
          `Hi Moi,\n\nYou have a new inquiry via Friday (your portfolio AI assistant):\n\nFrom: ${name}\nOpportunity: ${type}\nDetails: ${project}\n\n---\nSent via moi.dev`
        );
        setTimeout(() => {
          window.location.href = `mailto:nugalmoises62@gmail.com?subject=${subject}&body=${body}`;
        }, 1800);
      }
    }, 800 + Math.random() * 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  // Drag logic
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - dragPos.x, y: e.clientY - dragPos.y });
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const onMouseUp = () => setIsDragging(false);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .hire-input::placeholder { color: #1e293b !important; }
        .hire-input:focus { outline: none; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: "rgba(4,7,14,0.6)",
          backdropFilter: "blur(6px)",
          animation: "backdropIn 0.3s ease",
        }}
      />

      {/* Window */}
      <div
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          position: "fixed",
          zIndex: 1000,
          top: "50%",
          left: "50%",
          transform: `translate(calc(-50% + ${dragPos.x}px), calc(-50% + ${dragPos.y}px))`,
          width: "min(480px, 94vw)",
          background: "rgba(6, 10, 20, 0.98)",
          border: `1px solid rgba(0,255,136,0.18)`,
          borderRadius: "16px",
          boxShadow: `0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), 0 0 60px rgba(0,255,136,0.04)`,
          overflow: "hidden",
          animation: "modalIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          userSelect: isDragging ? "none" : "auto",
        }}
      >
        {/* Title Bar */}
        <div
          onMouseDown={onMouseDown}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px",
            background: "rgba(255,255,255,0.02)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: "flex", gap: "7px", alignItems: "center" }}>
            <button onClick={onClose} style={{
              width: "13px", height: "13px", borderRadius: "50%",
              background: "#ff5f57", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "8px", color: "transparent", transition: "color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(0,0,0,0.6)"}
            onMouseLeave={e => e.currentTarget.style.color = "transparent"}
            >✕</button>
            <button onClick={() => setIsMinimized(v => !v)} style={{
              width: "13px", height: "13px", borderRadius: "50%",
              background: "#febc2e", border: "none", cursor: "pointer",
            }} />
            <div style={{
              width: "13px", height: "13px", borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }} />
          </div>

          {/* Title */}
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            fontFamily: "'Fira Code', monospace",
            fontSize: "11px",
            color: "#475569",
            letterSpacing: "0.06em",
          }}>
            <span style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: isDone ? "#4ade80" : ACCENT,
              boxShadow: `0 0 8px ${isDone ? "#4ade80" : ACCENT}`,
              animation: isDone ? "none" : "typingBounce 2s ease-in-out infinite",
            }} />
            friday — hiring assistant
          </div>

          {/* Status */}
          <div style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: "9px",
            color: "#1e293b",
            letterSpacing: "0.08em",
          }}>
            {isDone ? "SENT ✓" : `STEP ${Math.min(step + 1, 3)}/3`}
          </div>
        </div>

        {/* Collapsed / Minimized */}
        {!isMinimized && (
          <>
            {/* Progress bar */}
            <div style={{ height: "2px", background: "rgba(255,255,255,0.04)" }}>
              <div style={{
                height: "100%",
                width: `${isDone ? 100 : (step / 3) * 100}%`,
                background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_BLUE})`,
                transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              }} />
            </div>

            {/* Messages */}
            <div style={{
              height: "340px",
              overflowY: "auto",
              padding: "20px 16px 8px",
              scrollbarWidth: "thin",
              scrollbarColor: `rgba(0,255,136,0.15) transparent`,
            }}>
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}
              {isTyping && (
                <div style={{ display: "flex", gap: "10px", marginBottom: "16px", alignItems: "flex-end" }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "8px",
                    background: `linear-gradient(135deg, ${ACCENT}22, ${ACCENT_BLUE}22)`,
                    border: `1px solid ${ACCENT}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", flexShrink: 0,
                  }}>◈</div>
                  <div style={{
                    padding: "4px 8px",
                    background: "rgba(0,255,136,0.05)",
                    border: `1px solid rgba(0,255,136,0.12)`,
                    borderRadius: "4px 14px 14px 14px",
                  }}>
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "0 16px" }} />

            {/* Input Area */}
            <div style={{ padding: "14px 16px" }}>
              {!isDone ? (
                <div style={{
                  display: "flex", gap: "10px", alignItems: "center",
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid rgba(255,255,255,0.07)`,
                  borderRadius: "10px",
                  padding: "10px 14px",
                  transition: "border-color 0.2s",
                }}
                onFocus={() => {}}
                >
                  <span style={{
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "12px",
                    color: "#00ff8844",
                    flexShrink: 0,
                  }}>›</span>
                  <input
                    ref={inputRef}
                    className="hire-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your answer..."
                    disabled={isTyping}
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      fontFamily: "'Fira Code', monospace",
                      fontSize: "12px",
                      color: "#cbd5e1",
                      caretColor: ACCENT,
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: "32px", height: "32px",
                      background: input.trim() && !isTyping ? `${ACCENT}18` : "transparent",
                      border: `1px solid ${input.trim() && !isTyping ? ACCENT + "55" : "rgba(255,255,255,0.06)"}`,
                      borderRadius: "7px",
                      cursor: input.trim() && !isTyping ? "pointer" : "default",
                      color: input.trim() && !isTyping ? ACCENT : "#1e293b",
                      fontSize: "13px",
                      transition: "all 0.2s",
                      flexShrink: 0,
                    }}
                  >↑</button>
                </div>
              ) : (
                /* Done state — contact links */
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { label: "Email Moi", href: "mailto:nugalmoises62@gmail.com", color: ACCENT },
                    { label: "LinkedIn", href: "https://www.linkedin.com/in/moises-nugal-1b06833b1", color: ACCENT_BLUE },
                    { label: "GitHub", href: "https://github.com/moi-script", color: ACCENT_PURPLE },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        flex: 1,
                        padding: "9px 12px",
                        textAlign: "center",
                        background: `${link.color}10`,
                        border: `1px solid ${link.color}33`,
                        borderRadius: "8px",
                        color: link.color,
                        fontSize: "10px",
                        fontFamily: "'Fira Code', monospace",
                        textDecoration: "none",
                        letterSpacing: "0.05em",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${link.color}20`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = `${link.color}10`; }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}

              {/* Hint */}
              <p style={{
                margin: "10px 0 0",
                fontFamily: "'Fira Code', monospace",
                fontSize: "9px",
                color: "#1e293b",
                textAlign: "center",
                letterSpacing: "0.06em",
              }}>
                {isDone ? "Your default mail client will open automatically" : "Press Enter to send"}
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HireMeModal;