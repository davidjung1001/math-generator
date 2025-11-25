import OpenAI from "openai";

export async function POST(req) {
  const { notes, question } = await req.json();

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `
You are a concise and precise tutor. Here are the lecture notes:

"${notes}"

Answer the student’s question clearly and directly. 

- Give the **correct answer first**.  
- Include brief reasoning or justification if it helps, but keep it short.  
- Use Markdown formatting for clarity (headings, bullet points, bold where helpful).  
- Only use information from the notes.  
- If the answer can be referenced, mention the **lesson and section** it comes from.  

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
