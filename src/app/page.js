// app/page.js
import Link from "next/link";

export default function Home() {
  const topics = ["circles", "fractions"];

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-4">
      <h1 className="text-4xl font-bold mb-6">Math Worksheet Generator</h1>
      <p>Select a topic:</p>
      <ul className="space-y-2">
        {topics.map((t) => (
          <li key={t}>
            <Link
              href={`/topics/${t}`}
              className="text-blue-600 underline hover:text-blue-800 capitalize"
            >
              {t}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
