import pdf from "html-pdf-node";
import { remark } from "remark";
import html from "remark-html";

export async function POST(req) {
  const { content } = await req.json();

  // Convert Markdown to HTML
  const markdownProcessed = await remark().use(html).process(content);
  const htmlContent = markdownProcessed.toString();

  const fullHtml = `
    <html>
      <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
        <style>
          body { font-family: sans-serif; padding: 40px; color: #111827; line-height: 1.5; }
          h1, h2, h3 { color: #111827; }
          pre { background: #f9fafb; padding: 8px; }
          .problem { margin-bottom: 24px; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

  const file = { content: fullHtml };
  const pdfBuffer = await pdf.generatePdf(file, { format: "A4" });

  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="worksheet.pdf"',
    },
  });
}
