import "./globals.css"
// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          id="MathJax-script"
          async
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        ></script>
      </head>
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
