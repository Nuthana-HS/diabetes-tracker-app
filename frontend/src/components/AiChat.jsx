import { useState, useRef, useEffect } from "react";
import api from "../services/api";

export default function AiChat() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your diabetes assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userMessage = text || input;
    if (!userMessage.trim()) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);
    try {
      const response = await api.post("/ai/chat", { message: userMessage });
      setMessages((prev) => [...prev, { role: "ai", text: response.data.reply || "I'm here to help!" }]);
    } catch (error) {
      const errMsg = error?.error || error?.message || "Something went wrong.";
      setMessages((prev) => [...prev, { role: "ai", text: errMsg, error: true }]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = ["How are my levels?", "What should I eat?", "Summarize my week"];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col">
      <div className="bg-purple-700 text-white px-4 py-3 rounded-t-xl">
        <h3 className="font-semibold">🤖 AI Assistant</h3>
      </div>
      <div className="h-80 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
              msg.role === "user" ? "bg-purple-600 text-white" :
              msg.error ? "bg-red-100 text-red-700 border border-red-300" :
              "bg-gray-100 text-gray-800"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-500 animate-pulse">Typing...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="px-3 pt-2 flex gap-2 flex-wrap">
        {quickQuestions.map((q) => (
          <button key={q} onClick={() => sendMessage(q)} disabled={loading}
            className="text-xs px-3 py-1 border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50">
            {q}
          </button>
        ))}
      </div>
      <div className="p-3 border-t flex gap-2 mt-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
          placeholder="Ask me anything..." disabled={loading}
          className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50" />
        <button onClick={() => sendMessage()} disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-purple-700">
          Send
        </button>
      </div>
    </div>
  );
}
