"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSnap() {
    if (!url) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/snap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || `HTTP ${res.status}`);
      else setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-8">
      <div className="max-w-4xl w-full space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4 pt-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            WebSnap API
          </h1>
          <p className="text-xl text-gray-400">
            URL → Structured JSON in one call.
          </p>
          <p className="text-gray-500 max-w-xl mx-auto">
            Extract titles, meta tags, OG data, content, links, images, and tech stack from any URL.
            Built for AI agents and developers.
          </p>
        </div>

        {/* Try It */}
        <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">🔍 Try It</h2>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSnap()}
              placeholder="https://example.com"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSnap}
              disabled={loading || !url}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium transition whitespace-nowrap"
            >
              {loading ? "Snapping..." : "Snap →"}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          {result && (
            <pre className="mt-4 p-4 bg-gray-950 rounded-lg text-sm text-emerald-400 overflow-x-auto max-h-96 overflow-y-auto">
              {result}
            </pre>
          )}
        </section>

        {/* Quick Example */}
        <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">⚡ Quick Start</h2>
          <pre className="p-4 bg-gray-950 rounded-lg text-sm overflow-x-auto">
            <code className="text-gray-300">{`curl -X POST https://websnap-api.vercel.app/api/snap \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`}</code>
          </pre>
        </section>

        {/* What You Get */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-center">What You Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "📄", title: "Meta & OG Tags", desc: "Title, description, Open Graph, Twitter Cards, favicon, canonical URL" },
              { icon: "📝", title: "Content Extract", desc: "Clean main content text with noise removal — scripts, nav, ads stripped" },
              { icon: "🔗", title: "Links & Images", desc: "All links (internal/external flagged) and images with alt text" },
              { icon: "⚙️", title: "Tech Stack", desc: "Detect 30+ technologies: frameworks, CMS, analytics, CDN, servers" },
              { icon: "⏱️", title: "Performance", desc: "Fetch time, content size, HTTP status — monitor any site" },
              { icon: "🔒", title: "Auth & Rate Limits", desc: "API key authentication with tiered rate limits" },
            ].map((f) => (
              <div key={f.title} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { tier: "Free", price: "$0", desc: "100 requests/day", features: ["All extraction features", "Rate limited", "No API key needed"] },
              { tier: "Pro", price: "$9/mo", desc: "10,000 requests/month", features: ["Priority rate limits", "API key", "Email support"], highlight: true },
              { tier: "Business", price: "$29/mo", desc: "100,000 requests/month", features: ["Highest rate limits", "Dedicated key", "Priority support"] },
            ].map((p) => (
              <div key={p.tier} className={`rounded-xl p-6 border ${p.highlight ? "bg-blue-950/30 border-blue-700" : "bg-gray-900 border-gray-800"}`}>
                <h3 className="text-lg font-bold">{p.tier}</h3>
                <div className="text-3xl font-bold mt-2">{p.price}</div>
                <p className="text-gray-500 text-sm mt-1">{p.desc}</p>
                <ul className="mt-4 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="text-sm text-gray-400 flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Links */}
        <div className="flex gap-4 justify-center pb-8">
          <a href="/docs" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition">
            Documentation
          </a>
          <a href="/dashboard" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition">
            Dashboard
          </a>
          <a href="https://github.com/botsix-workspace/websnap-api" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition">
            GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
