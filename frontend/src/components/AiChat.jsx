"use client";
import { useState } from "react";

export default function AiChat({ userData }) {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I am your diabetes assistant. Ask me anything about your health data!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, userData }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      border: "1px solid #e0e0e0",
      borderRadius: "12px",
      padding: "16px",
      maxWidth: "600px",
      margin: "20px auto",
      fontFamily: "sans-serif"
    }}>
      <h3 style={{ margin: "0 0 12px", color: "#2d7a4f" }}>
        AI Diabetes Assistant
      </h3>

      <div style={{
        height: "350px",
        overflowY: "auto",
        marginBottom: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            background: msg.role === "user" ? "#2d7a4f" : "#f0f0f0",
            color: msg.role === "user" ? "white" : "#333",
            padding: "10px 14px",
            borderRadius: "18px",
            maxWidth: "80%",
            fontSize: "14px",
            lineHeight: "1.5"
          }}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div style={{
            alignSelf: "flex-start",
            background: "#f0f0f0",
            padding: "10px 14px",
            borderRadius: "18px",
            fontSize: "14px",
            color: "#888"
          }}>
            Thinking...
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about your health data..."
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            fontSize: "14px",
            outline: "none"
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            background: "#2d7a4f",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 18px",
            fontSize: "14px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
