import { useEffect, useRef, useState } from "react";
import { RotateCcw, X } from "lucide-react";
import chatbot from "../data/chatbot.json";
import { gsap, useGSAP } from "../gsap.js";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion.js";
import { SendIcon } from "./Icon.jsx";

const MASCOT = "🤖";
const TYPING_DELAY = 800;
const GREETING = { id: 0, role: "bot", text: chatbot.greeting };

function findFaq(text) {
  const t = text.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const faq of chatbot.faqs) {
    const score = faq.keywords.filter((k) => t.includes(k.toLowerCase())).length;
    if (score > bestScore) {
      best = faq;
      bestScore = score;
    }
  }
  return best;
}

export default function ChatBot() {
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);
  const timelineRef = useRef(null);
  const timerRef = useRef(null);
  const idRef = useRef(1);
  const [isOpen, setIsOpen] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([GREETING]);
  const [typing, setTyping] = useState(false);
  const [answered, setAnswered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return undefined;
      const timeline = gsap.timeline({ paused: true });
      timeline.fromTo(
        panelRef.current,
        { autoAlpha: 0, scale: 0.92, y: 14, transformOrigin: "bottom right" },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.26, ease: "back.out(1.5)" },
      );
      timelineRef.current = timeline;
      return () => {
        timeline.kill();
        timelineRef.current = null;
      };
    },
    { scope: rootRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (isOpen) timelineRef.current?.play();
    else timelineRef.current?.reverse();
  }, [isOpen, prefersReducedMotion]);

  useEffect(() => {
    if (isOpen) {
      setPulse(false);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const box = messagesRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [messages, typing]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function ask(text, faq) {
    const clean = text.trim();
    if (!clean || typing) return;
    const match = faq ?? findFaq(clean);
    const userId = idRef.current++;
    const botId = idRef.current++;

    setMessages((cur) => [...cur, { id: userId, role: "user", text: clean }]);
    setDraft("");
    setTyping(true);
    setAnswered(true);

    timerRef.current = setTimeout(
      () => {
        setTyping(false);
        setMessages((cur) => [
          ...cur,
          { id: botId, role: "bot", text: match?.a ?? chatbot.fallback, link: match?.link },
        ]);
      },
      prefersReducedMotion ? 0 : TYPING_DELAY,
    );
  }

  function reset() {
    clearTimeout(timerRef.current);
    idRef.current = 1;
    setTyping(false);
    setAnswered(false);
    setMessages([GREETING]);
  }

  return (
    <div className="chat-widget" ref={rootRef}>
      <section
        className={`chat-panel${isOpen ? " is-open" : ""}${prefersReducedMotion ? " reduced-motion" : ""}`}
        id="chat-panel"
        ref={panelRef}
        role="dialog"
        aria-label="FandomVerse assistant"
        aria-hidden={!isOpen}
      >
        <header className="chat-header">
          <div className="chat-title">
            <span className="chat-avatar" aria-hidden="true">{MASCOT}</span>
            <div>
              <strong>FandomVerse Assistant</strong>
              <small><span className="online-dot" aria-hidden="true" /> Always here for you ✨</small>
            </div>
          </div>
          <div className="chat-header-actions">
            {answered && (
              <button type="button" onClick={reset} aria-label="Start over">
                <RotateCcw size={16} aria-hidden="true" />
              </button>
            )}
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="chat-messages" ref={messagesRef} role="log" aria-live="polite" aria-relevant="additions text">
          {messages.map((m) => (
            <div className={`chat-row ${m.role}`} key={m.id}>
              {m.role === "bot" && <span className="chat-avatar small" aria-hidden="true">{MASCOT}</span>}
              <div className={`chat-message ${m.role === "user" ? "user-message" : "bot-message"}`}>
                {m.text}
                {m.link && (
                  <a className="chat-link" href={m.link.href} onClick={() => setIsOpen(false)}>
                    {m.link.label} →
                  </a>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="chat-row bot">
              <span className="chat-avatar small" aria-hidden="true">{MASCOT}</span>
              <div className="chat-message bot-message typing-dots" aria-label="Assistant is typing">
                <span /><span /><span />
              </div>
            </div>
          )}
        </div>

        <div className="chat-footer">
          {!typing &&
            (!answered ? (
              <div className="faq-list" aria-label="Suggested questions">
                <p>Tap a question below 👇</p>
                {chatbot.faqs.map((faq) => (
                  <button type="button" key={faq.q} onClick={() => ask(faq.q, faq)} style={{marginLeft: 15}}>
                    {faq.q}
                  </button>
                ))}
              </div>
            ) : (
              <div className="chat-actions">
                <p>Got another question?</p>
                <button type="button" className="primary" onClick={reset}>
                  <RotateCcw size={15} aria-hidden="true" /> Ask another question
                </button>
              </div>
            ))}

          <form className="chat-form" onSubmit={(e) => { e.preventDefault(); ask(draft); }}>
            <label className="sr-only" htmlFor="chat-message-input">Message the FandomVerse assistant</label>
            <input
              ref={inputRef}
              id="chat-message-input"
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Or type your own question…"
              autoComplete="off"
            />
            <button type="submit" aria-label="Send message" disabled={!draft.trim() || typing}>
              <SendIcon />
            </button>
          </form>
        </div>
      </section>

      <button
        className={`chat-launcher${pulse ? " is-pulsing" : ""}`}
        type="button"
        onClick={() => setIsOpen((cur) => !cur)}
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={isOpen}
        aria-controls="chat-panel"
      >
        <span aria-hidden="true">{isOpen ? "×" : MASCOT}</span>
      </button>
    </div>
  );
}