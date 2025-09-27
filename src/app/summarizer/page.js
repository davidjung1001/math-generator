"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function SummarizerPage() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setSummary("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/summarize", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setSummary(data.summary || data.error);
    setLoading(false);
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Lecture Summarizer</h1>
      <p className="text-gray-700">Upload a transcript (.txt) and get detailed study notes.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept=".txt"
          onChange={(e) => setFile(e.target.files[0])}
          className="block"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Summarize
        </button>
      </form>

      {loading && <p>⏳ Summarizing...</p>}

      {summary && (
  <div className="bg-gray-100 p-4 rounded prose max-w-none text-black">
    <ReactMarkdown>{summary}</ReactMarkdown>
  </div>
)}
    </div>
  );
}
