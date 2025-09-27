// app/api/generateWorksheet/route.js
import OpenAI from "openai";


export const runtime = "nodejs";

export async function POST(req) {
  const { topic = "fractions", numProblems = 10, difficulty = "medium" } = await req.json();
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `
Generate a math worksheet with ${numProblems} ${difficulty} level problems about ${topic}.
Format the worksheet in Markdown.
Use LaTeX for fractions and exponents with:
- Block math: $$ ... $$
- Inline math: $ ... $
Do NOT use square brackets.

Number the questions and leave two lines between each question.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1500,
  });

  return new Response(JSON.stringify({ worksheet: response.choices[0].message.content.trim() }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
