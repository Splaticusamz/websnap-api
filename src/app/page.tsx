"use client";

import { useMemo, useState } from "react";
import { formatPlanPrice, getPlanEntries } from "@/lib/plans";

type CheckoutState =
  | { status: "idle" }
  | { status: "loading"; plan: string }
  | {
      status: "ready" | "manual" | "needs-config" | "error";
      plan?: string;
      title: string;
      detail: string;
      checkoutUrl?: string;
      nextStep?: string;
    };

const sampleResponse = {
  title: "Acme Cloud",
  description: "Cloud infrastructure for fast-moving engineering teams.",
  techStack: ["Next.js", "Vercel", "Cloudflare"],
  headings: ["Ship faster", "Scale without ops drag"],
  useCase: "Lead enrichment + agent context",
};

const exampleWorkflows = [
  {
    title: "Lead enrichment",
    copy: "Pull company metadata, tech stack, and clean content before outreach or CRM enrichment.",
  },
  {
    title: "Agent ingestion",
    copy: "Turn docs, blog posts, and landing pages into structured context for LLM workflows.",
  },
  {
    title: "SEO + metadata ops",
    copy: "Collect titles, descriptions, canonicals, links, and content blocks in one request.",
  },
];

const proofCards = [
  ["One call", "Send a URL, get structured JSON back."],
  ["Built for pipelines", "Works for agents, cron jobs, webhooks, and internal tools."],
  ["Clear upgrade path", "Free tier for testing, paid plans for production usage."],
  ["Fast operator visibility", "Pricing, checkout readiness, and ops status are all already wired."],
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingEmail, setBillingEmail] = useState("");
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({ status: "idle" });
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

  async function handleCheckout(plan: "pro" | "business") {
    setCheckoutState({ status: "loading", plan });

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          email: billingEmail.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.checkoutUrl) {
        setCheckoutState({
          status: "ready",
          plan,
          title: `${plan === "pro" ? "Pro" : "Business"} checkout is ready`,
          detail: "Redirecting to the hosted checkout flow now.",
          checkoutUrl: data.checkoutUrl,
        });
        window.location.href = data.checkoutUrl;
        return;
      }

      if (data.mode === "manual-fallback") {
        setCheckoutState({
          status: "manual",
          plan,
          title: `${plan === "pro" ? "Pro" : "Business"} is in manual fallback mode`,
          detail:
            "Live hosted checkout is not configured in this deployment yet, but the plan mapping and provisioning path are ready.",
          nextStep: data.nextStep,
        });
        return;
      }

      if (data.mode === "stripe-price-configured") {
        setCheckoutState({
          status: "needs-config",
          plan,
          title: `${plan === "pro" ? "Pro" : "Business"} needs final Stripe session wiring`,
          detail:
            "A Stripe price is configured, but hosted checkout session creation is not enabled in this deployment yet.",
        });
        return;
      }

      setCheckoutState({
        status: "error",
        plan,
        title: "Checkout request failed",
        detail: data.error || `HTTP ${res.status}`,
      });
    } catch (e) {
      setCheckoutState({
        status: "error",
        plan,
        title: "Checkout request failed",
        detail: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-8 text-gray-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.20),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_20%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,1))] p-8 shadow-2xl shadow-cyan-950/30">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
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
                  "Titles, OG tags, content, links, images, tech stack",
                  "Free tier + direct paid upgrade path",
                ].map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#pricing" className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-gray-950 transition hover:bg-cyan-300">
                  See pricing
                </a>
                <a href="#checkout" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
                  Get API access
                </a>
                <a href="/docs" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
                  Read docs
                </a>
                <a href="https://github.com/Splaticusamz/websnap-api" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
                  GitHub
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/25 p-6 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">Example output</p>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  Great for first-call demos
                </span>
              </div>
              <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-[#020617] p-4 text-sm leading-6 text-emerald-300">{JSON.stringify(sampleResponse, null, 2)}</pre>
              <div className="mt-5 grid gap-3 text-sm text-slate-300">
                {exampleWorkflows.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-1">{item.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Try the API</h2>
                <p className="mt-1 text-sm text-slate-400">Paste any public URL and see the shape of the response.</p>
              </div>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Free tier available
              </span>
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
                ["1", "Run one snap request against a public URL"],
                ["2", "Verify the output shape fits your workflow"],
                ["3", "Choose Free, Pro, or Business based on volume"],
                ["4", "Move into production with checkout + key provisioning"],
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
          {proofCards.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-2 text-lg font-semibold text-white">{value}</p>
            </div>
          ))}
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
              const isPaid = plan.key !== "free";
              const highlight = plan.key === "pro";
              return (
                <div key={plan.key} className={`rounded-3xl border p-6 ${highlight ? "border-cyan-400/40 bg-cyan-500/10" : "border-white/10 bg-black/20"}`}>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{plan.name}</p>
                  <div className="mt-3 text-4xl font-black text-white">{formatPlanPrice(plan.key)}</div>
                  <p className="mt-2 text-sm text-slate-300">
                    {plan.monthlyRequests.toLocaleString()} requests/month · {plan.burstPerMinute}/min burst
                  </p>
                  <ul className="mt-5 space-y-2 text-sm text-slate-200">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2"><span className="text-emerald-300">✓</span><span>{feature}</span></li>
                    ))}
                  </ul>
                  {isPaid ? (
                    <button
                      onClick={() => handleCheckout(plan.key === "pro" ? "pro" : "business")}
                      disabled={checkoutState.status === "loading"}
                      className={`mt-6 inline-flex rounded-xl px-4 py-3 font-semibold transition ${highlight ? "bg-cyan-400 text-gray-950 hover:bg-cyan-300" : "border border-white/10 bg-white/5 text-white hover:bg-white/10"}`}
                    >
                      {checkoutState.status === "loading" && checkoutState.plan === plan.key ? "Checking checkout..." : plan.cta}
                    </button>
                  ) : (
                    <a href="/docs" className="mt-6 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10">
                      {plan.cta}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section id="checkout" className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Checkout + provisioning</p>
              <h2 className="mt-3 text-2xl font-bold text-white">Move from test traffic to production usage</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Use the free tier to validate your workflow, then switch to a paid plan for higher monthly volume and faster burst limits.
                If hosted checkout is configured, the button redirects immediately. If not, the page tells you exactly what remains.
              </p>
              <label className="mt-5 block text-sm text-slate-300">
                Billing / contact email (optional)
                <input
                  type="email"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </label>
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={() => handleCheckout("pro")} className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-gray-950 transition hover:bg-cyan-300">
                  Start Pro
                </button>
                <button onClick={() => handleCheckout("business")} className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
                  Start Business
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
              <h3 className="text-lg font-semibold text-white">Current checkout status</h3>
              {checkoutState.status === "idle" && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  Pick a paid plan to test the current checkout path. The response will either redirect to hosted checkout or explain the fallback state.
                </div>
              )}
              {checkoutState.status === "loading" && (
                <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
                  <p className="font-semibold text-white">Checking {checkoutState.plan} checkout</p>
                  <p className="mt-2">Resolving the current billing path for this plan.</p>
                </div>
              )}
              {checkoutState.status !== "idle" && checkoutState.status !== "loading" && (
                <div className={`mt-4 rounded-2xl border p-4 text-sm ${checkoutState.status === "error" ? "border-rose-500/20 bg-rose-500/10 text-rose-200" : checkoutState.status === "ready" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-100" : "border-amber-500/20 bg-amber-500/10 text-amber-100"}`}>
                  <p className="font-semibold text-white">{checkoutState.title}</p>
                  <p className="mt-2">{checkoutState.detail}</p>
                  {checkoutState.nextStep && <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/70">Next step: {checkoutState.nextStep}</p>}
                  {checkoutState.checkoutUrl && (
                    <a href={checkoutState.checkoutUrl} className="mt-4 inline-flex rounded-xl bg-white px-4 py-2 font-semibold text-gray-950">
                      Open checkout manually
                    </a>
                  )}
                </div>
              )}
              <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
                {[
                  ["Free", "Use docs + test workflow without a long setup"],
                  ["Pro", "For working agent or automation flows that need real monthly volume"],
                  ["Business", "For heavier internal tools, commercial workflows, or batch-style usage"],
                  ["Ops", "Pricing, webhook, and checkout readiness already map to plan tiers"],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="font-semibold text-white">{title}</p>
                    <p className="mt-1">{desc}</p>
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
