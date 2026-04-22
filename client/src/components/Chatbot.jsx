import { useState, useRef, useEffect } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your Student Support AI 🎓\nAsk me anything about your courses, policies, or student services!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const handleToggle = () => setOpen(prev => !prev);
    window.addEventListener("toggle-chatbot", handleToggle);
    return () => window.removeEventListener("toggle-chatbot", handleToggle);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: question }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: data.answer || "Sorry, I could not get an answer.", sources: data.sources || [] }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "Connection error. Please make sure all servers are running." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Floating Button ────────────────────────────────── */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          width: "58px",
          height: "58px",
          borderRadius: "50%",
          background: "#2563eb",
          color: "white",
          fontSize: "26px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(37,99,235,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s",
        }}
        title="Student Support AI"
      >
        {open ? "✕" : "💬"}
      </button>

      {/* ── Chat Window ─────────────────────────────────────── */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "24px",
            zIndex: 9999,
            width: "350px",
            height: "500px",
            background: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#2563eb",
              color: "white",
              padding: "14px 18px",
              fontWeight: "600",
              fontSize: "15px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0
            }}
          >
            🎓 Student Support AI
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              background: "#f9fafb",
            }}
          >
            {messages.map((msg, i) => (
              <div key={i}>
                <div
                  style={{
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    display: "inline-block",
                    float: msg.role === "user" ? "right" : "left",
                    clear: "both",
                    background: msg.role === "user" ? "#2563eb" : "#ffffff",
                    color: msg.role === "user" ? "white" : "#111827",
                    padding: "10px 14px",
                    borderRadius:
                      msg.role === "user"
                        ? "16px 4px 16px 16px"
                        : "4px 16px 16px 16px",
                    maxWidth: "82%",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </div>

                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div style={{ clear: "both", marginTop: "4px", paddingLeft: "4px" }}>
                    {msg.sources.map((src, j) => (
                      <span
                        key={j}
                        style={{
                          fontSize: "11px",
                          color: "#6b7280",
                          background: "#e5e7eb",
                          padding: "2px 7px",
                          borderRadius: "10px",
                          marginRight: "4px",
                          display: "inline-block",
                          marginTop: "2px"
                        }}
                      >
                        📄 {src.source} — p.{src.page}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  background: "#ffffff",
                  padding: "10px 14px",
                  borderRadius: "4px 16px 16px 16px",
                  fontSize: "14px",
                  color: "#9ca3af",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                }}
              >
                Thinking...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              display: "flex",
              padding: "10px 12px",
              borderTop: "1px solid #e5e7eb",
              gap: "8px",
              background: "#ffffff",
              flexShrink: 0
            }}
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              disabled={loading}
              style={{
                flex: 1,
                padding: "9px 13px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                outline: "none",
                background: loading ? "#f9fafb" : "white"
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "9px 16px",
                borderRadius: "8px",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "14px",
                opacity: loading || !input.trim() ? 0.5 : 1,
                transition: "opacity 0.2s"
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}