"use client";
import { useState, useRef, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const SUGGESTED_QUESTIONS = [
  "How are my levels?",
  "What should I eat?",
  "Summarize my week"
];

export default function AiChat() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your diabetes assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-scroll to bottom
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendSpecificMessage = (msgText) => {
    if (!msgText.trim()) return;
    setInput("");
    handleSendMessage(msgText);
  };

  const sendMessage = () => sendSpecificMessage(input);

  const handleSendMessage = async (userMessage) => {
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: "⚠️ Note: You must be logged in to chat. Please log in first." },
        ]);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/v1/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "error", text: data.error || "Sorry, something went wrong with the server." },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: data.reply || "I'm here to help!" },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "error", text: "Sorry, something went wrong communicating with the AI. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200">
      <div className="bg-blue-600 text-white px-4 py-3 rounded-t-xl">
        <h3 className="font-semibold">🤖 AI Assistant</h3>
      </div>
      <div className="h-80 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${msg.role === "user"
              ? "bg-blue-600 text-white"
              : msg.role === "error"
                ? "bg-red-100 text-red-700 font-medium border border-red-200"
                : "bg-gray-100 text-gray-800"
              }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-500">Typing...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-3 py-2 flex flex-wrap gap-2 border-t">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => sendSpecificMessage(q)}
            disabled={loading}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask me anything..."
          disabled={loading}
          className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}