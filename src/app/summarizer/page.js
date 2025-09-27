"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Bot } from "lucide-react"; // AI icon

export default function SummarizerPage() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file && !text.trim()) return;

    setLoading(true);
    setSummary("");

    const formData = new FormData();
    if (file) formData.append("file", file);
    if (text.trim()) formData.append("text", text);

    const res = await fetch("/api/summarize", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setSummary(data.summary || data.error);
    setLoading(false);
  }

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Bot className="w-8 h-8 text-blue-500" />
        Lecture Summarizer
      </h1>
      <p className="text-gray-700">
        Upload a transcript or paste text below to get detailed study notes.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File upload */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Upload transcript
          </label>
          <label className="cursor-pointer flex items-center justify-center w-full sm:w-auto px-4 py-2 
                             bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 text-sm md:text-base">
            <input
              type="file"
              accept=".txt,.md,.docx,.pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
            📂 Choose File
          </label>
          {file && (
            <p className="mt-2 text-sm text-gray-600 truncate">
              Selected: {file.name}
            </p>
          )}
        </div>

        {/* Text input */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Or paste text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-400"
            placeholder="Paste transcript or lecture notes here..."
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full sm:w-auto bg-green-500 text-white px-6 py-2 rounded-lg 
                     font-medium hover:bg-green-600 transition"
        >
          Summarize
        </button>
      </form>

      {loading && <p className="text-gray-600">⏳ Summarizing...</p>}

      {summary && (
        <div className="bg-white border rounded-lg p-4 shadow space-y-2">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Bot className="w-5 h-5 text-green-500" /> AI Summary
          </h2>
          <div className="prose max-w-none text-gray-800">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
