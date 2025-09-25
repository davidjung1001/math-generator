"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default function Worksheet({ content }) {
  // Call backend to generate PDF
  const downloadPDF = async () => {
    const res = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      alert("Failed to generate PDF");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "worksheet.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div
        style={{
          backgroundColor: "#fff",
          color: "#111827",
          padding: "40px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          boxSizing: "border-box",
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {content}
        </ReactMarkdown>
      </div>

      <button
        onClick={downloadPDF} // now correctly defined
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Download as PDF
      </button>
    </div>
  );
}
