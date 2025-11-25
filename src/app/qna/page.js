"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Bot, User, Upload } from "lucide-react";
import Tesseract from "tesseract.js";
import ReactMarkdown from "react-markdown";

export default function QnAPage() {
  const [notes, setNotes] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connecting...");
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load all messages from database
  const loadMessages = async () => {
    const { data, error } = await supabase
      .from("qna_messages")
      .select("*")
      .order("created_at", { ascending: true });
    
    if (!error && data) {
      setMessages(data);
    }
  };

  // Ask AI and save both question and answer
  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);

    // Save user question to database
    await supabase
      .from("qna_messages")
      .insert([{ 
        role: "user", 
        content: question
      }]);

    // Call your API to get AI answer
    const res = await fetch("/api/qna", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes, question }),
    });

    const data = await res.json();

    // Save AI answer to database
    await supabase
      .from("qna_messages")
      .insert([{ 
        role: "assistant", 
        content: data.answer 
      }]);

    setQuestion("");
    setLoading(false);
  };

  // OCR for question image
  const handleQuestionImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    try {
      const { data } = await Tesseract.recognize(file, "eng");
      setQuestion(data.text.trim());
    } catch (err) {
      console.error("OCR failed:", err);
    }
    setOcrLoading(false);
  };

  // Read lecture notes from file
  const handleNotesFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setNotes(text);
  };

  useEffect(() => {
    loadMessages();

    // Set up realtime subscription
    const channel = supabase
      .channel("qna_realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "qna_messages",
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe((status) => {
        setConnectionStatus(status);
        if (status === "SUBSCRIBED") {
          console.log("✅ Connected to realtime");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-500" />
          Shared Lecture Q&A
        </h1>
        <span className={`text-xs px-2 py-1 rounded ${
          connectionStatus === "SUBSCRIBED" 
            ? "bg-green-100 text-green-700" 
            : "bg-yellow-100 text-yellow-700"
        }`}>
          {connectionStatus === "SUBSCRIBED" ? "🟢 Live" : "⚠️ " + connectionStatus}
        </span>
      </div>

      <p className="text-gray-600 text-sm">
        Everyone can see questions and answers in real-time. Upload notes or paste them below.
      </p>

      {/* Notes input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Lecture Notes (Optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400"
          placeholder="Paste transcript or notes here..."
        />
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 border rounded-lg p-2 cursor-pointer hover:bg-gray-50">
            <Upload className="w-4 h-4" />
            <span className="text-sm">Upload .txt file</span>
            <input
              type="file"
              accept=".txt"
              onChange={handleNotesFile}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Chat messages */}
      <div className="border rounded-lg p-6 h-[600px] md:h-[700px] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 space-y-4">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-20">No messages yet. Ask a question to get started!</p>
        )}
        {messages.map((msg, index) => (
          <div
            key={msg.uuid || msg.id || index}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && <Bot className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />}
            <div
              className={`px-5 py-3 rounded-lg max-w-[85%] md:max-w-[75%] break-words shadow-sm ${
                msg.role === "user" 
                  ? "bg-blue-600 text-white prose-invert" 
                  : "bg-white border border-gray-200 text-gray-900"
              }`}
            >
              <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                <ReactMarkdown>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
            {msg.role === "user" && <User className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Ask section */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Type your question..."
          className="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
        />
        
        <label className="flex items-center justify-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50 min-w-[120px]">
          📷 {ocrLoading ? "Reading..." : "Snap Q"}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleQuestionImage}
            className="hidden"
          />
        </label>

        <button
          onClick={handleAsk}
          disabled={loading || ocrLoading || !question.trim()}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Asking..." : "Ask"}
        </button>
      </div>
    </div>
  );
}