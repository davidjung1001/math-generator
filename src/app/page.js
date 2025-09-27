import Link from "next/link";

export default function Home() {
  const topics = ["circles", "fractions"];

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold mb-6">Math Worksheet Generator</h1>
      
      <div>
        <p className="font-semibold mb-2">Select a topic:</p>
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

      <div className="border-t border-gray-300 pt-6">
        <h2 className="text-2xl font-bold mb-2">Lecture Summarizer</h2>
        <p className="mb-2">Upload a transcript file and turn it into study notes:</p>
        <Link
          href="/summarizer"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go to Summarizer
        </Link>
      </div>
    </div>
  );
}
