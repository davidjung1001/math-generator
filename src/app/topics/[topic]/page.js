// app/topics/[topic]/page.js
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Worksheet from "../../../components/Worksheet";

export default function TopicPage() {
  const router = useRouter();
  const { topic } = useParams();
  const [worksheet, setWorksheet] = useState("");
  const [loading, setLoading] = useState(false);

  const generateWorksheet = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/generateWorksheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, numProblems: 10 }),
      });
      const data = await res.json();
      setWorksheet(data.worksheet);
    } catch (err) {
      console.error(err);
      setWorksheet("Error generating worksheet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => router.push("/")}
        className="text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← Back to Topics
      </button>

      <h1 className="text-3xl font-bold mb-4 capitalize">{topic} Worksheet</h1>

      <button
        onClick={generateWorksheet}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {loading ? "Generating..." : "Generate Worksheet"}
      </button>

      {worksheet && <Worksheet content={worksheet} />}
    </div>
  );
}
