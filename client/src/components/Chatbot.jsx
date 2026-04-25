import { useState, useRef, useEffect } from "react";
import { Paperclip, Send, X, MessageCircle } from "lucide-react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your Student Support AI 🎓\nAsk me anything about your courses, policies, or student services!\n\nYou can also upload PDFs to expand my knowledge base."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

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
      
      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 100)}`);
      }
      
      if (!res.ok) {
        const errorText = data.answer || data.error || "Error: Failed to get response from server.";
        const isQuotaExceeded = errorText.includes("quota exceeded") || res.status === 429;
        
        setMessages(prev => [
          ...prev,
          { 
            role: "assistant", 
            text: isQuotaExceeded 
              ? `⚠️ AI quota exceeded. Please try again in a few minutes.\n\nNote: This happens when the daily limit for the Gemini API is reached.`
              : `❌ Error: ${errorText}`
          }
        ]);
        return;
      }

      const isQuotaExceeded = data.answer && data.answer.includes("quota exceeded");
      setMessages(prev => [
        ...prev,
        { 
          role: "assistant", 
          text: isQuotaExceeded 
            ? `⚠️ ${data.answer}\n\nPlease wait a few minutes before trying again.` 
            : (data.answer || "Sorry, I could not get an answer."), 
          sources: data.sources || [] 
        }
      ]);
    } catch (error) {
      console.error("Chatbot fetch error:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: `❌ Connection error: ${error.message}. Please check if all servers are running.` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload only PDF files.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/chatbot/upload", {
        method: "POST",
        body: formData,
      });
      
      let data;
      try {
        data = await res.json();
      } catch (e) {
        data = { error: "Server returned an invalid response." };
      }
      
      if (res.ok) {
        setMessages(prev => [
          ...prev,
          { role: "assistant", text: `✅ Successfully processed: ${file.name}\n${data.message}` }
        ]);
      } else {
        const errorText = data.error || data.detail || "Unknown error";
        const isQuotaExceeded = errorText.includes("quota exceeded") || res.status === 429;
        
        setMessages(prev => [
          ...prev,
          { 
            role: "assistant", 
            text: isQuotaExceeded
              ? `❌ Upload failed: Quota exceeded. Please wait a few minutes before uploading again.`
              : `❌ Upload failed: ${errorText}` 
          }
        ]);
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "❌ Connection error during upload. Please try again later." }
      ]);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
        {open ? <X size={24} /> : <MessageCircle size={24} />}
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
            {(loading || uploading) && (
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
                {uploading ? "Uploading & Processing..." : "Thinking..."}
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
              flexShrink: 0,
              alignItems: "center"
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf"
              style={{ display: "none" }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || uploading}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                color: "#6b7280",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: loading || uploading ? 0.5 : 1
              }}
              title="Upload PDF Knowledge"
            >
              <Paperclip size={20} />
            </button>

            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              disabled={loading || uploading}
              style={{
                flex: 1,
                padding: "9px 13px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                outline: "none",
                background: loading || uploading ? "#f9fafb" : "white"
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || uploading || !input.trim()}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "9px 16px",
                borderRadius: "8px",
                cursor: loading || uploading || !input.trim() ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "14px",
                opacity: loading || uploading || !input.trim() ? 0.5 : 1,
                transition: "opacity 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}