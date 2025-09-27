import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const text = await file.text();

    // Split by lectures
    const lectures = text.split("\n\n\n").map((lec) => lec.trim()).filter(Boolean);

    let summaries = [];

    for (let i = 0; i < lectures.length; i++) {
      const prompt = `
      Turn this lecture into detailed study notes that I can learn from.
      Include keywords and explanation.

      Lecture ${i + 1}:
      ${lectures[i]}
      `;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
      });

      summaries.push(`## Lecture ${i + 1}\n\n${response.choices[0].message.content}`);
    }

    return NextResponse.json({ summary: summaries.join("\n\n") });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
