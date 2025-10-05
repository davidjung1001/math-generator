"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function QnAPage() {
  const [notes, setNotes] = useState("");
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);

  // Handle asking the AI
  async function handleAsk(e) {
    e.preventDefault();
    if (!notes.trim() || !question.trim()) return;

    setLoading(true);
    const newChat = [...chat, { role: "user", content: question }];
    setChat(newChat);

    const res = await fetch("/api/qna", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes, question }),
    });

    const data = await res.json();
    setChat([...newChat, { role: "assistant", content: data.answer }]);
    setQuestion("");
    setLoading(false);
  }

  // OCR for question image
  async function handleQuestionImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    setOcrLoading(true);
    try {
      const { data } = await Tesseract.recognize(file, "eng");
      const extractedText = data.text.trim();
      setQuestion(extractedText);
    } catch (err) {
      console.error("OCR failed:", err);
    }
    setOcrLoading(false);
  }

  // Read lecture notes from file
  async function handleNotesFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    setNotes(text);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Bot className="w-6 h-6 text-blue-500" />
        Lecture Q&A
      </h1>
      <p className="text-gray-600">
        Provide lecture notes (paste or upload a file), then ask questions (type or take/upload a picture).
      </p>

      {/* Notes input */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={6}
        className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400 mb-2 sm:mb-0"
        placeholder="Paste transcript or notes here..."
      />
      <input
        type="file"
        accept=".txt"
        onChange={handleNotesFile}
        className="border rounded-lg p-2 cursor-pointer"
      />

      {/* Chat area */}
      <div className="space-y-4 mt-4">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && <Bot className="w-5 h-5 text-green-500" />}
            {msg.role === "user" && <User className="w-5 h-5 text-gray-500" />}
            <div
              className={`px-4 py-2 rounded-lg max-w-[80%] break-words ${
                msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      {/* Ask form with OCR support */}
      <form onSubmit={handleAsk} className="flex flex-col sm:flex-row gap-2 items-start sm:items-end mt-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question..."
          className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleQuestionImage}
          className="border rounded-lg p-2 cursor-pointer"
        />
        <button
          type="submit"
          disabled={loading || ocrLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
      {ocrLoading && <p className="text-gray-500 text-sm">📷 Extracting text from image...</p>}
    </div>
  );
}
