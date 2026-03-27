"use client";

import { useState, useEffect } from "react";

const LAUNCH_DATE = new Date("2026-03-27");
const NOW = new Date();

function ProgressBar({ value, max, color = "emerald" }: { value: number; max: number; color?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const colors: Record<string, string> = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    purple: "bg-purple-500",
    rose: "bg-rose-500",
  };
  return (
    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
      <div className={`${colors[color] || colors.emerald} h-3 rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; dot: string }> = {
    done: { bg: "bg-emerald-900/50", text: "text-emerald-400", dot: "bg-emerald-400" },
    "in-progress": { bg: "bg-amber-900/50", text: "text-amber-400", dot: "bg-amber-400 animate-pulse" },
    planned: { bg: "bg-gray-800", text: "text-gray-400", dot: "bg-gray-500" },
    blocked: { bg: "bg-rose-900/50", text: "text-rose-400", dot: "bg-rose-400" },
  };
  const s = map[status] || map.planned;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

export default function Dashboard() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const phases = [
    {
      name: "Phase 1: Core API",
      status: "done" as string,
      items: [
        { task: "Next.js scaffold + repo", done: true },
        { task: "POST /api/snap endpoint", done: true },
        { task: "HTML parsing (Cheerio)", done: true },
        { task: "OG tags / meta extraction", done: true },
        { task: "Tech stack detection", done: true },
        { task: "Rate limiting", done: true },
        { task: "API key auth", done: true },
        { task: "Landing page + docs", done: true },
        { task: "Deploy to Vercel", done: true },
      ],
    },
    {
      name: "Phase 2: Monetization",
      status: "planned" as string,
      items: [
        { task: "RapidAPI listing", done: false },
        { task: "Stripe metered billing", done: false },
        { task: "Usage dashboard", done: false },
      ],
    },
    {
      name: "Phase 3: Growth",
      status: "planned" as string,
      items: [
        { task: "Show HN post", done: false },
        { task: "Reddit / directories", done: false },
        { task: "Batch endpoint", done: false },
      ],
    },
  ];

  const totalTasks = phases.reduce((s, p) => s + p.items.length, 0);
  const doneTasks = phases.reduce((s, p) => s + p.items.filter(i => i.done).length, 0);

  const revenueTimeline = [
    { date: "Mar 27", event: "Project start", amount: "$0" },
    { date: "Mar 28", event: "Core API live", amount: "$0" },
    { date: "Mar 29", event: "RapidAPI listing", amount: "$0" },
    { date: "Apr 1-7", event: "First free users", amount: "$0" },
    { date: "Apr 15", event: "First paid conversions", amount: "$9-27" },
    { date: "May", event: "Organic growth", amount: "$50-200" },
    { date: "Jun", event: "Steady state", amount: "$200-500" },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">📸</span>
              WebSnap API — Hustle Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Private ops dashboard · Updated {time.toLocaleString()}</p>
          </div>
          <div className="flex gap-3">
            <span className="px-3 py-1.5 bg-emerald-900/40 text-emerald-400 rounded-lg text-sm font-medium border border-emerald-800">
              🟢 Vercel: Deployed
            </span>
            <span className="px-3 py-1.5 bg-emerald-900/40 text-emerald-400 rounded-lg text-sm font-medium border border-emerald-800">
              ✅ API: Live
            </span>
          </div>
        </div>

        {/* How It Works — Mermaid-style ASCII */}
        <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">🔄 How WebSnap Works</h2>
          <pre className="text-sm font-mono text-gray-300 overflow-x-auto leading-relaxed">{`
┌─────────────┐    POST /api/snap     ┌──────────────────┐
│   Client     │ ──────────────────►  │   WebSnap API    │
│  (AI Agent)  │   { url: "..." }     │   (Vercel Edge)  │
└─────────────┘                       └────────┬─────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │   1. Fetch URL       │
                                    │   2. Parse HTML      │
                                    │   3. Extract:        │
                                    │      • Title/Meta    │
                                    │      • OG Tags       │
                                    │      • Main Content  │
                                    │      • Links/Images  │
                                    │      • Tech Stack    │
                                    │      • Performance   │
                                    └──────────┬──────────┘
                                               │
┌─────────────┐    Structured JSON    ┌────────▼─────────┐
│   Client     │ ◄──────────────────  │   JSON Response   │
│  (AI Agent)  │   { title, meta,     │   (< 500ms avg)   │
└─────────────┘     content, ... }    └──────────────────┘
          `}</pre>
        </section>

        {/* Automation Flow */}
        <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">⚙️ Automation & Revenue Flow</h2>
          <pre className="text-sm font-mono text-gray-300 overflow-x-auto leading-relaxed">{`
┌────────────┐   ┌──────────────┐   ┌────────────────┐   ┌────────────┐
│  Developer  │   │  RapidAPI    │   │  Stripe        │   │  Revenue   │
│  Signs Up   ├──►│  Marketplace ├──►│  Metered Bill  ├──►│  $$$       │
└────────────┘   └──────────────┘   └────────────────┘   └────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │  Free Tier       │  ← 100 req/day
              │  Pro: $9/mo      │  ← 10K req/mo
              │  Business: $29   │  ← 100K req/mo
              └──────────────────┘

  GitHub Push ──► Vercel Auto-Deploy ──► Live in ~30s
  (zero-downtime)
          `}</pre>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Overall Progress", value: `${Math.round((doneTasks / totalTasks) * 100)}%`, sub: `${doneTasks}/${totalTasks} tasks`, color: "text-emerald-400" },
            { label: "Days Since Start", value: "0", sub: "Started today", color: "text-blue-400" },
            { label: "Est. Time to Revenue", value: "~19d", sub: "Mid-April target", color: "text-amber-400" },
            { label: "Monthly Revenue Goal", value: "$200+", sub: "By June 2026", color: "text-purple-400" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <p className="text-gray-500 text-sm">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
              <p className="text-gray-600 text-xs mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Development Tracker */}
        <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">🛠️ Development Status Tracker</h2>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Overall completion</span>
              <span className="text-emerald-400 font-medium">{Math.round((doneTasks / totalTasks) * 100)}%</span>
            </div>
            <ProgressBar value={doneTasks} max={totalTasks} />
          </div>
          <div className="space-y-6">
            {phases.map((phase) => {
              const pDone = phase.items.filter(i => i.done).length;
              return (
                <div key={phase.name}>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{phase.name}</h3>
                    <StatusBadge status={phase.status} />
                    <span className="text-xs text-gray-500 ml-auto">{pDone}/{phase.items.length}</span>
                  </div>
                  <ProgressBar value={pDone} max={phase.items.length} color={phase.status === "done" ? "emerald" : phase.status === "in-progress" ? "amber" : "purple"} />
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-1">
                    {phase.items.map((item) => (
                      <div key={item.task} className="flex items-center gap-2 text-sm py-0.5">
                        <span>{item.done ? "✅" : "⬜"}</span>
                        <span className={item.done ? "text-gray-500 line-through" : "text-gray-300"}>{item.task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Revenue Timeline */}
        <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">💰 Revenue Timeline</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700" />
            <div className="space-y-4">
              {revenueTimeline.map((item, i) => (
                <div key={i} className="flex items-start gap-4 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 shrink-0 ${
                    i === 0 ? "bg-emerald-600 text-white" : i <= 1 ? "bg-amber-600/50 text-amber-300" : "bg-gray-800 text-gray-500"
                  }`}>
                    {i === 0 ? "✓" : i + 1}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex justify-between items-baseline">
                      <span className="font-medium text-sm">{item.event}</span>
                      <span className={`text-sm font-mono ${item.amount !== "$0" ? "text-emerald-400" : "text-gray-600"}`}>{item.amount}</span>
                    </div>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Complementary Stats */}
        <section className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">📊 Complementary Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-sm text-gray-400 mb-2">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {["Next.js 14", "TypeScript", "Cheerio", "Vercel", "Tailwind"].map(t => (
                  <span key={t} className="px-2 py-1 bg-gray-700 rounded text-xs">{t}</span>
                ))}
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-sm text-gray-400 mb-2">Market Fit</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>AI Agent demand</span><span className="text-emerald-400">🔥 High</span></div>
                <div className="flex justify-between"><span>Competition</span><span className="text-amber-400">Medium</span></div>
                <div className="flex justify-between"><span>Barrier to entry</span><span className="text-emerald-400">Low</span></div>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-sm text-gray-400 mb-2">Infrastructure Cost</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Hosting (Vercel)</span><span className="text-emerald-400">$0</span></div>
                <div className="flex justify-between"><span>Domain</span><span className="text-gray-400">$0 (using .vercel.app)</span></div>
                <div className="flex justify-between"><span>Total monthly</span><span className="text-emerald-400 font-bold">$0</span></div>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center text-gray-600 text-xs py-4">
          WebSnap API · Internal Dashboard · {time.toLocaleDateString()}
        </footer>
      </div>
    </main>
  );
}
