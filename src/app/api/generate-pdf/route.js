import pdf from "html-pdf-node";

export async function POST(req) {
  try {
    const { content } = await req.json();

    // Wrap your Markdown content in HTML
    const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
          <style>
            body {
              font-family: sans-serif;
              padding: 40px;
              color: #111827;
              line-height: 1.5;
            }
            h1, h2, h3 {
              color: #111827;
            }
            pre {
              background: #f9fafb;
              padding: 8px;
            }
            .problem {
              margin-bottom: 16px;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;

    const file = { content: htmlContent };

    // Generate PDF
    const pdfBuffer = await pdf.generatePdf(file, { format: "A4" });

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="worksheet.pdf"',
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("Error generating PDF", { status: 500 });
  }
}
