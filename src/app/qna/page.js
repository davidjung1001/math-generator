"use client";

import { useState } from "react";
import { Bot, User } from "lucide-react";

export default function QnAPage() {
  const [notes, setNotes] = useState("");
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleAsk(e) {
    e.preventDefault();
    if (!notes.trim() || !question.trim()) return;

    setLoading(true);

    // Add user message
    const newChat = [...chat, { role: "user", content: question }];
    setChat(newChat);

    const res = await fetch("/api/qna", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes, question }),
    });

    const data = await res.json();

    // Add AI response
    setChat([...newChat, { role: "assistant", content: data.answer }]);
    setQuestion("");
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Bot className="w-6 h-6 text-blue-500" />
        Lecture Q&A
      </h1>
      <p className="text-gray-600">
        Paste lecture notes, then ask questions about them.
      </p>

      {/* Notes input */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={6}
        className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400"
        placeholder="Paste transcript or notes here..."
      />

      {/* Chat area */}
      <div className="space-y-4">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <Bot className="w-5 h-5 text-green-500" />
            )}
            {msg.role === "user" && (
              <User className="w-5 h-5 text-gray-500" />
            )}
            <div
              className={`px-4 py-2 rounded-lg max-w-[80%] ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Ask form */}
      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
    </div>
  );
}
