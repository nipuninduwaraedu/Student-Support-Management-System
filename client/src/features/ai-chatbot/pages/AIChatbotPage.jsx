import { useEffect, useRef, useState } from "react";
import "../../../styles/chatbot.css";

function AIChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { id: Date.now(), role: "user", content: text }]);
    setInput("");
    // Assistant replies: wire `sendChatMessage` / RAG in `services/chatApi.js` when ready.
  };

  const onSubmit = (e) => {
    e.preventDefault();
    send();
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="gpt-app">
      <header className="gpt-header">
        <div className="gpt-header-inner">
          <span className="gpt-logo" aria-hidden="true" />
          <div className="gpt-header-text">
            <span className="gpt-header-title">Your 24/7 AI Helpdesk</span>
            <span className="gpt-header-sub">Always here for students</span>
          </div>
        </div>
      </header>

      <main className="gpt-thread" ref={listRef}>
        <div className={`gpt-thread-inner ${isEmpty ? "gpt-thread-inner--empty" : ""}`}>
          {isEmpty && (
            <div className="gpt-empty">
              <div className="gpt-empty-glow" aria-hidden="true" />
              <h1 className="gpt-empty-title">Your 24/7 AI Helpdesk</h1>
              <p className="gpt-empty-line">How can we help you today?</p>
            </div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`gpt-turn ${m.role === "user" ? "gpt-turn-user" : "gpt-turn-assistant"}`}
            >
              {m.role === "assistant" && (
                <div className="gpt-avatar" aria-hidden="true">
                  AI
                </div>
              )}
              <div className="gpt-turn-body">
                <div className="gpt-message">{m.content}</div>
              </div>
              {m.role === "user" && (
                <div className="gpt-avatar gpt-avatar-user" aria-hidden="true">
                  You
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <footer className="gpt-footer">
        <form className="gpt-composer" onSubmit={onSubmit}>
          <div className="gpt-composer-field">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Message your 24/7 AI Helpdesk…"
              aria-label="Message"
            />
            <button
              type="submit"
              className="gpt-send"
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                />
              </svg>
            </button>
          </div>
        </form>
        <p className="gpt-footnote">
          AI responses may be imperfect. For official decisions, follow your
          university’s guidance.
        </p>
      </footer>
    </div>
  );
}

export default AIChatbotPage;
