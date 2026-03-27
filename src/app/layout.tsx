import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WebSnap API — URL to Structured JSON",
  description: "Extract structured data from any URL. Titles, meta tags, content, tech stack detection — all in one API call.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 antialiased">{children}</body>
    </html>
  );
}
