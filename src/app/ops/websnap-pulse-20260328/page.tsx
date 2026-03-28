"use client";

import { useEffect, useMemo, useState } from "react";

const launchedAt = new Date("2026-03-27T03:00:00Z");
const profitTarget = new Date("2026-04-15T00:00:00Z");

const phases: { name: string; status: string; color: string; tasks: [string, boolean][] }[] = [
  {
    name: "Phase 1 · Core API",
    status: "done",
    color: "emerald",
    tasks: [
      ["Next.js scaffold + GitHub repo", true],
      ["Production Vercel deploy", true],
      ["/api/snap extraction endpoint", true],
      ["API key auth + rate limiting", true],
      ["Tech stack detection", true],
      ["Landing page + docs", true],
    ],
  },
  {
    name: "Phase 2 · Monetization + packaging",
    status: "done",
    color: "amber",
    tasks: [
      ["Pricing + packaging docs", true],
      ["Billing scaffolding", true],
      ["RapidAPI listing materials", true],
      ["Private hustle dashboard", true],
      ["Hourly dev tracker", true],
      ["Conversion-focused landing + docs", true],
    ],
  },
  {
    name: "Phase 3 · Automation + revenue activation",
    status: "in-progress",
    color: "blue",
    tasks: [
      ["Checkout automation endpoint", true],
      ["Billing webhook receiver", true],
      ["Ops status endpoint", true],
      ["Vercel cron automation", true],
      ["Landing page checkout UX", true],
      ["Operator readiness dashboard", true],
      ["Direct Stripe live config", false],
      ["First paid conversions", false],
    ],
  },
];

const revenueTimeline = [
  { label: "Mar 27", title: "Build + deploy core API", revenue: "$0", state: "done" },
  { label: "Mar 28", title: "Packaging + monetization prep", revenue: "$0", state: "done" },
  { label: "Mar 28", title: "Automation layer + checkout UX shipped", revenue: "$0", state: "active" },
  { label: "Mar 30", title: "Marketplace + hosted checkout live", revenue: "$0-19", state: "next" },
  { label: "Apr 8-15", title: "First real paid conversion window", revenue: "$19-98", state: "next" },
  { label: "May", title: "Steady funnel optimization", revenue: "$100-300", state: "later" },
  { label: "Jun", title: "Small but real side-income", revenue: "$300-750", state: "later" },
];

const stats = [
  { label: "Best channel", value: "Docs-led API", tone: "emerald" },
  { label: "Target buyers", value: "Agent builders", tone: "blue" },
  { label: "Monthly cost", value: "$0-$20", tone: "violet" },
  { label: "Expected first profit", value: "~2-3 weeks", tone: "amber" },
];

function toneClasses(tone: string) {
  const map: Record<string, string> = {
    emerald: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
    blue: "text-blue-300 border-blue-500/30 bg-blue-500/10",
    amber: "text-amber-300 border-amber-500/30 bg-amber-500/10",
    violet: "text-violet-300 border-violet-500/30 bg-violet-500/10",
    rose: "text-rose-300 border-rose-500/30 bg-rose-500/10",
    slate: "text-slate-300 border-white/10 bg-white/5",
  };
  return map[tone] || map.slate;
}

function ProgressBar({ value, max, tone = "emerald" }: { value: number; max: number; tone?: string }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / Math.max(max, 1)) * 100)));
  const fill: Record<string, string> = {
    emerald: "from-emerald-400 to-teal-500",
    amber: "from-amber-400 to-orange-500",
    blue: "from-blue-400 to-cyan-500",
    violet: "from-violet-400 to-fuchsia-500",
  };

  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
      <div className={`h-full rounded-full bg-gradient-to-r ${fill[tone] || fill.emerald} transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${toneClasses(tone)}`}>{children}</span>;
}

export default function HustleOpsDashboard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const totalTasks = phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
  const doneTasks = phases.reduce((sum, phase) => sum + phase.tasks.filter(([, done]) => done).length, 0);
  const overallPct = Math.round((doneTasks / totalTasks) * 100);
  const daysRunning = Math.max(1, Math.ceil((now.getTime() - launchedAt.getTime()) / 86_400_000));
  const msToProfit = profitTarget.getTime() - now.getTime();
  const daysToProfit = Math.max(0, Math.ceil(msToProfit / 86_400_000));

  const hourlyBlocks = useMemo(() => {
    const currentHour = now.getUTCHours();
    return [
      { hour: 0, label: "00:00", task: "Check deploy + cron automation" },
      { hour: 4, label: "04:00", task: "Billing + docs + ops endpoint pass" },
      { hour: 8, label: "08:00", task: "Distribution assets review" },
      { hour: 12, label: "12:00", task: "Usage + pricing sanity pass" },
      { hour: 16, label: "16:00", task: "Growth opportunities + backlog" },
      { hour: 20, label: "20:00", task: "Nightly hustle checkpoint" },
    ].map((block) => ({
      ...block,
      state: currentHour >= block.hour + 1 ? "done" : currentHour >= block.hour ? "active" : "upcoming",
    }));
  }, [now]);

  const projectedBars = [
    { label: "Shipping speed", value: 88, tone: "emerald" },
    { label: "Monetization readiness", value: 79, tone: "amber" },
    { label: "Distribution readiness", value: 68, tone: "blue" },
    { label: "Revenue confidence", value: 59, tone: "violet" },
  ];

  return (
    <main className="min-h-screen bg-[#060816] px-4 py-8 text-slate-100 md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))] p-6 shadow-2xl shadow-cyan-950/30 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <Badge tone="rose">PRIVATE OPS VIEW · unlinked route · noindex intended</Badge>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">WebSnap API · Night Hustle Dashboard</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
                  Internal operator board for the current hustle. Tracks shipping velocity, automation readiness, monetization
                  infrastructure, and the path from deployed API to paid usage.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="emerald">🟢 Vercel live</Badge>
                <Badge tone="emerald">✅ Core API shipped</Badge>
                <Badge tone="amber">💳 Billing scaffolding live</Badge>
                <Badge tone="blue">⏰ Cron + webhook automation added</Badge>
              </div>
            </div>

            <div className="grid min-w-[300px] grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current status</p>
                <p className="mt-2 text-2xl font-bold text-emerald-300">{overallPct}% complete</p>
                <p className="mt-1 text-sm text-slate-400">Automation + packaging sprint</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Updated</p>
                <p className="mt-2 text-lg font-semibold text-white">{now.toUTCString()}</p>
                <p className="mt-1 text-sm text-slate-400">Auto-refreshes every minute</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-black/20">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className={`mt-2 text-2xl font-bold ${toneClasses(stat.tone).split(" ")[0]}`}>{stat.value}</p>
            </div>
          ))}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-black/20 xl:col-span-2">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
              <span>Execution progress</span>
              <span>{doneTasks}/{totalTasks} complete</span>
            </div>
            <ProgressBar value={doneTasks} max={totalTasks} tone="emerald" />
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Days running</p>
                <p className="mt-1 text-xl font-semibold text-white">{daysRunning}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Days to first profit window</p>
                <p className="mt-1 text-xl font-semibold text-amber-300">~{daysToProfit} days</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-cyan-500/20 bg-slate-950/70 p-6 shadow-xl shadow-cyan-950/20">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">How the hustle works</h2>
              <Badge tone="blue">visual systems view</Badge>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-[#030712] p-4 text-[12px] leading-5 text-cyan-100">{`mermaid\nflowchart LR\n  A[Traffic: docs / GitHub / RapidAPI] --> B[Landing page]\n  B --> C[Copy curl snippet]\n  C --> D[POST /api/snap]\n  D --> E[Structured JSON response]\n  E --> F[Useful automation outcome]\n  F --> G[Upgrade to paid plan]\n  G --> H[Checkout endpoint]\n  H --> I[Webhook / provisioning]\n  I --> J[Recurring revenue]\n`}</pre>
              <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-[#030712] p-4 text-[12px] leading-5 text-slate-200">{`┌──────────────┐    ┌───────────────┐    ┌────────────────┐
│ Traffic in   │ -> │ Docs + landing│ -> │ First API call │
└──────┬───────┘    └──────┬────────┘    └──────┬─────────┘
       │                   │                     │
       │                   ▼                     ▼
       │          Example response         Useful result
       │                   │                     │
       ▼                   ▼                     ▼
  RapidAPI / SEO      Clear pricing       Checkout + webhook
       \____________________  ___________________/
                            \/
                     recurring monthly revenue
`}</pre>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Automation flow</h2>
              <Badge tone="amber">deploy loop</Badge>
            </div>
            <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-[#030712] p-4 text-[12px] leading-5 text-slate-200">{`┌────────┐   push   ┌─────────┐   build   ┌──────────┐
│ GitHub │ ───────► │ Vercel  │ ───────► │ Production│
└───┬────┘          └────┬────┘          └────┬──────┘
    │                    │                    │
    │                    ▼                    ▼
    │              hourly cron          docs / dashboard
    │                    │                    │
    │                    ▼                    ▼
    │              ops status route     checkout + webhook
    │                    │                    │
    └────────────── feedback + next sprint ◄──┘
`}</pre>
            <div className="mt-4 grid gap-3">
              {[
                ["Source of truth", "GitHub main"],
                ["Deploy target", "Vercel production"],
                ["Primary CTA", "Try API / get key"],
                ["Automation live", "cron + checkout + webhook"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-medium text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Revenue timeline</h2>
              <Badge tone="emerald">path to first dollars</Badge>
            </div>
            <div className="relative ml-2 space-y-4 border-l border-white/10 pl-6">
              {revenueTimeline.map((step) => (
                <div key={step.label + step.title} className="relative">
                  <span className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full ${step.state === "done" ? "bg-emerald-400" : step.state === "active" ? "bg-amber-400 animate-pulse" : step.state === "next" ? "bg-blue-400" : "bg-slate-600"}`} />
                  <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{step.label}</p>
                      <p className="mt-1 font-semibold text-white">{step.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Expected revenue</p>
                      <p className="font-mono text-sm text-emerald-300">{step.revenue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Complementary stats</h2>
              <Badge tone="violet">confidence gauges</Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {projectedBars.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="font-medium text-white">{item.value}%</span>
                  </div>
                  <ProgressBar value={item.value} max={100} tone={item.tone} />
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {[
                ["Free tier", "100 req/day"],
                ["Pro plan", "$19/mo"],
                ["Business plan", "$79/mo"],
                ["Cron checks", "Hourly + daily"],
                ["Main risk", "Traffic without conversion"],
                ["Main upside", "Agent-friendly API niche"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                  <p className="mt-1 font-medium text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Development status tracker</h2>
              <p className="mt-1 text-sm text-slate-400">Hourly checkpoints update relative to the current UTC hour.</p>
            </div>
            <Badge tone="amber">updates hourly</Badge>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              {phases.map((phase) => {
                const completed = phase.tasks.filter(([, done]) => done).length;
                return (
                  <div key={phase.name} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-white">{phase.name}</h3>
                      <Badge tone={phase.color}>{phase.status}</Badge>
                      <span className="ml-auto text-xs text-slate-500">{completed}/{phase.tasks.length}</span>
                    </div>
                    <ProgressBar value={completed} max={phase.tasks.length} tone={phase.color} />
                    <div className="mt-4 grid gap-2 md:grid-cols-2">
                      {phase.tasks.map(([task, done]) => (
                        <div key={task} className="flex items-center gap-2 text-sm">
                          <span>{done ? "✅" : "⬜"}</span>
                          <span className={done ? "text-slate-500 line-through" : "text-slate-200"}>{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h3 className="font-semibold text-white">UTC hourly operator board</h3>
              <div className="mt-4 space-y-3">
                {hourlyBlocks.map((block) => (
                  <div key={block.label} className={`rounded-xl border px-4 py-3 ${block.state === "done" ? "border-emerald-500/20 bg-emerald-500/10" : block.state === "active" ? "border-amber-500/30 bg-amber-500/10" : "border-white/10 bg-white/[0.03]"}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-mono text-sm text-white">{block.label} UTC</p>
                        <p className="text-sm text-slate-300">{block.task}</p>
                      </div>
                      <Badge tone={block.state === "done" ? "emerald" : block.state === "active" ? "amber" : "slate"}>{block.state}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
