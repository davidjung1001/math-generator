import OpenAI from "openai";

export async function POST(req) {
  const { notes, question } = await req.json();

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `
You are a helpful tutor. Here are the lecture notes:

"${notes}"

Now, answer this student’s question in a **clear, structured format** using Markdown.  
Only use information from the notes.
Your answer should include these sections (if relevant):
- ## Overview (short introduction)
- ## Key Points (bullet points or numbered list)
- ## Summary (concise wrap-up)

If the question is about a single concept, explain it step by step. Always use headings, bullet points, and bolding where helpful.
  
Student’s Question: "${question}"
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  const answer = response.choices[0].message.content;

  return new Response(JSON.stringify({ answer }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
