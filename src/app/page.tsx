"use client";

import { useMemo, useState } from "react";
import { CheckoutCta } from "@/components/checkout-cta";
import { formatPlanPrice, getPlanEntries } from "@/lib/plans";

const sampleResponse = {
  title: "Acme Cloud",
  description: "Cloud infrastructure for fast-moving engineering teams.",
  techStack: ["Next.js", "Vercel", "Cloudflare"],
  useCase: "Lead enrichment + agent context",
};

const proofPoints = [
  {
    title: "Lead enrichment before outreach",
    summary: "Pull a company homepage into JSON, grab the title/description/links, and detect their stack before a rep or agent writes the first message.",
    snippet: `curl -X POST https://websnap-api.vercel.app/api/snap \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: your_key_here" \\
  -d '{"url":"https://stripe.com"}'`,
  },
  {
    title: "Docs ingestion for AI agents",
    summary: "Turn public docs pages into clean content blocks and metadata for retrieval, context windows, or background research jobs.",
    snippet: `{
  "url": "https://nextjs.org/docs",
  "options": { "includeContent": true, "includeTechStack": false }
}`,
  },
  {
    title: "SEO and metadata QA",
    summary: "Check OG tags, Twitter card, canonical, links, and images in one response instead of juggling crawlers and scrapers.",
    snippet: `response.ogTags.title
response.twitterCard.card
response.links.length`,
  },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const plans = useMemo(() => getPlanEntries(), []);

  async function handleSnap() {
    if (!url) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/snap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          options: { includeContent: true, includeTechStack: true, includePerformance: true },
        }),
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
    <main className="min-h-screen bg-gray-950 px-6 py-8 text-gray-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.20),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_20%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,1))] p-8 shadow-2xl shadow-cyan-950/30">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">URL → structured JSON</p>
              <h1 className="mt-3 text-5xl font-black tracking-tight text-white md:text-6xl">WebSnap API</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
                Turn any public webpage into structured JSON in one API call. Built for AI agents, enrichment pipelines,
                automations, internal tools, and developer workflows that need fast HTML extraction instead of browser automation.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-200">
                {[
                  "Fast setup for agents and pipelines",
                  "Titles, OG tags, headings, contact signals, JSON-LD, tech stack",
                  "Free tier + direct paid upgrade path",
                ].map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{item}</span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#try-it" className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-gray-950 transition hover:bg-cyan-300">Try it now</a>
                <a href="#pricing" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10">See pricing</a>
                <a href="/docs" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10">Read docs</a>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  ["5 minutes", "Typical time from first curl to working JSON output"],
                  ["1 endpoint", "Enough to test the product without a SaaS maze"],
                  ["3 tiers", "Start free, then upgrade when the workflow sticks"],
                ].map(([metric, label]) => (
                  <div key={metric} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-2xl font-black text-white">{metric}</p>
                    <p className="mt-1 text-sm text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/25 p-6 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">Example output</p>
                <a href="/dashboard" className="text-xs text-cyan-300 hover:text-cyan-200">Operator view →</a>
              </div>
              <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-[#020617] p-4 text-sm leading-6 text-emerald-300">{JSON.stringify(sampleResponse, null, 2)}</pre>
              <div className="mt-5 grid gap-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">AI agent builders use it for page-to-context ingestion.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Outbound teams use it for company-site enrichment before outreach.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Automation builders use it inside scheduled jobs and webhooks.</div>
              </div>
            </div>
          </div>
        </section>

        <section id="try-it" className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Try the API</h2>
                <p className="mt-1 text-sm text-slate-400">Paste any public URL and see the shape of the response.</p>
              </div>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">Free tier available</span>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSnap()}
                placeholder="https://example.com"
                className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              />
              <button
                onClick={handleSnap}
                disabled={loading || !url}
                className="rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-gray-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                {loading ? "Snapping..." : "Run snap"}
              </button>
            </div>
            {error && <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div>}
            {result && <pre className="mt-4 max-h-[420px] overflow-auto rounded-2xl border border-white/10 bg-[#020617] p-4 text-sm text-emerald-300">{result}</pre>}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-bold text-white">The fast onboarding path</h2>
            <div className="mt-5 grid gap-3">
              {[
                ["1", "Paste a URL or send POST /api/snap"],
                ["2", "Inspect the JSON and confirm it fits your workflow"],
                ["3", "Use the docs examples for AI agents, enrichment, or SEO QA"],
                ["4", "Upgrade with one click when you need more volume"],
              ].map(([step, text]) => (
                <div key={step} className="flex gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-gray-950">{step}</div>
                  <p className="pt-2 text-slate-200">{text}</p>
                </div>
              ))}
            </div>
            <pre className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-[#020617] p-4 text-sm text-slate-200"><code>{`curl -X POST https://websnap-api.vercel.app/api/snap \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: your_key_here" \\
  -d '{"url":"https://example.com"}'`}</code></pre>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Best for", "AI agents, enrichment, SEO, automations"],
            ["Core value", "HTML page in → structured JSON out"],
            ["Differentiator", "Tech stack detection + content + contact/JSON-LD extraction"],
            ["Automation-ready", "Designed for scheduled jobs, webhooks, and pipelines"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-2 text-lg font-semibold text-white">{value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Proof-of-value examples</h2>
              <p className="text-sm text-slate-400">Three practical workflows buyers can recognize immediately.</p>
            </div>
            <a href="/docs#examples" className="text-sm font-medium text-cyan-300 hover:text-cyan-200">More examples →</a>
          </div>
          <div className="mt-5 grid gap-4 xl:grid-cols-3">
            {proofPoints.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.summary}</p>
                <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-[#020617] p-4 text-xs leading-6 text-cyan-100">{item.snippet}</pre>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">What you get back</h2>
              <p className="text-sm text-slate-400">Useful fields for product, automation, and research workflows.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              ["Meta + OG", "Title, description, Open Graph tags, Twitter cards, favicon, canonical URL"],
              ["Main content", "Cleaned body text with navigation/script noise removed"],
              ["Links + images", "Internal/external links, image sources, alt text, dimensions when present"],
              ["Contact + schema", "Mailto/tel links, social profiles, headings, and parsed JSON-LD blocks"],
              ["Tech detection", "Frameworks, CMSs, analytics, CDNs, hosting clues"],
              ["Performance", "Fetch timing, content size, HTTP status"],
              ["Operational headers", "Rate-limit headers tied to tier and request window"],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-bold text-white">Use cases that actually pay</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Lead enrichment", "Pull company-page metadata and tech stack before outreach."],
              ["Agent ingestion", "Convert docs pages, blogs, and landing pages into structured context."],
              ["Automation", "Run scheduled URL checks and webhook-triggered extraction jobs."],
              ["SEO tooling", "Collect metadata, links, and content blocks for analysis workflows."],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Simple pricing</h2>
              <p className="text-sm text-slate-400">Built to convert quickly without dragging buyers through a big SaaS setup.</p>
            </div>
            <a href="/docs" className="text-sm font-medium text-cyan-300 hover:text-cyan-200">See full API docs →</a>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => {
              const highlight = plan.key === "pro";
              return (
                <div key={plan.key} className={`rounded-3xl border p-6 ${highlight ? "border-cyan-400/40 bg-cyan-500/10" : "border-white/10 bg-black/20"}`}>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{plan.name}</p>
                  <div className="mt-3 text-4xl font-black text-white">{formatPlanPrice(plan.key)}</div>
                  <p className="mt-2 text-sm text-slate-300">{plan.monthlyRequests.toLocaleString()} requests/month · {plan.burstPerMinute}/min burst</p>
                  <ul className="mt-5 space-y-2 text-sm text-slate-200">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2"><span className="text-emerald-300">✓</span><span>{feature}</span></li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    {plan.key === "free" ? (
                      <a href="#try-it" className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10">
                        {plan.cta}
                      </a>
                    ) : (
                      <CheckoutCta
                        plan={plan.key}
                        label={plan.cta}
                        className={`inline-flex rounded-xl px-4 py-3 font-semibold transition ${highlight ? "bg-cyan-400 text-gray-950 hover:bg-cyan-300" : "border border-white/10 bg-white/5 text-white hover:bg-white/10"}`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
