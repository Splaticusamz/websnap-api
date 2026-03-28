import { formatPlanPrice, getPlanEntries } from "@/lib/plans";

const plans = getPlanEntries();

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-gray-950 px-6 py-10 text-gray-100">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <a href="/" className="text-sm text-cyan-300 hover:text-cyan-200">← Back to home</a>
          <h1 className="mt-4 text-4xl font-black text-white">WebSnap API docs</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            One endpoint, fast setup, structured output. Use it for AI agents, scheduled jobs, webhook-triggered workflows,
            lead enrichment, and metadata extraction from public webpages.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">POST /api/snap</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">GET /api/health</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">POST /api/billing/checkout</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">POST /api/billing/webhook</span>
          </div>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-2xl font-bold text-white">Quick start</h2>
          <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-[#020617] p-4 text-sm text-slate-200"><code>{`curl -X POST https://websnap-api.vercel.app/api/snap \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: your_key_here" \\
  -d '{
    "url": "https://github.com",
    "options": {
      "includeContent": true,
      "includeTechStack": true,
      "includePerformance": true
    }
  }'`}</code></pre>
          <p className="mt-4 text-sm text-slate-400">No dashboard maze. Send a URL, inspect the JSON, then automate around it.</p>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-2xl font-bold text-white">Request</h2>
            <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-black/20 p-4">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-slate-400">
                  <tr>
                    <th className="pb-3 pr-4">Header</th>
                    <th className="pb-3 pr-4">Required</th>
                    <th className="pb-3">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/10"><td className="py-3 pr-4 font-mono">Content-Type</td><td className="pr-4">Yes</td><td>application/json</td></tr>
                  <tr className="border-t border-white/10"><td className="py-3 pr-4 font-mono">x-api-key</td><td className="pr-4">Optional</td><td>Required for paid plans / higher limits</td></tr>
                </tbody>
              </table>
            </div>
            <pre className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-[#020617] p-4 text-sm text-slate-200">{`{
  "url": "https://example.com",
  "options": {
    "includeContent": true,
    "includeTechStack": true,
    "includePerformance": true
  }
}`}</pre>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-2xl font-bold text-white">Response shape</h2>
            <pre className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-[#020617] p-4 text-sm text-emerald-300">{`{
  "url": "https://example.com",
  "title": "Example Domain",
  "description": "This domain is for use in illustrative examples...",
  "canonical": "https://example.com",
  "favicon": "https://example.com/favicon.ico",
  "ogTags": { "title": "Example Domain", "description": "..." },
  "twitterCard": { "card": "summary_large_image" },
  "links": [{ "href": "https://example.com/about", "text": "About", "isExternal": false }],
  "images": [{ "src": "https://example.com/logo.png", "alt": "Logo" }],
  "meta": { "language": "en", "charset": "utf-8" },
  "mainContent": "Cleaned page content...",
  "techStack": [{ "name": "Next.js", "confidence": "high", "evidence": "__NEXT_DATA__ script" }],
  "performance": { "fetchTimeMs": 142, "contentLength": 1256, "statusCode": 200 }
}`}</pre>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-2xl font-bold text-white">Rate limits and plans</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.key} className={`rounded-2xl border p-5 ${plan.key === "pro" ? "border-cyan-400/30 bg-cyan-500/10" : "border-white/10 bg-black/20"}`}>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{plan.name}</p>
                <p className="mt-2 text-3xl font-black text-white">{formatPlanPrice(plan.key)}</p>
                <p className="mt-2 text-sm text-slate-300">{plan.monthlyRequests.toLocaleString()} monthly · {plan.burstPerMinute}/min burst</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-200">
                  {plan.features.map((feature) => <li key={feature}>• {feature}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-400">
            Response headers include <code className="text-slate-200">X-RateLimit-Limit</code>, <code className="text-slate-200">X-RateLimit-Remaining</code>, <code className="text-slate-200">X-RateLimit-Reset</code>, <code className="text-slate-200">X-RateLimit-Plan</code>, and <code className="text-slate-200">X-RateLimit-Window</code>.
          </p>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-2xl font-bold text-white">Automation endpoints</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-semibold text-white">POST /api/billing/checkout</p>
                <p className="mt-2">Send <code className="text-slate-200">{`{"plan":"pro"}`}</code> or <code className="text-slate-200">{`{"plan":"business"}`}</code> to resolve the current checkout target.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-semibold text-white">POST /api/billing/webhook</p>
                <p className="mt-2">Webhook receiver for billing automation. Supports shared-secret validation and returns plan-mapping/provisioning guidance.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-semibold text-white">GET /api/ops/status</p>
                <p className="mt-2">Ops snapshot endpoint used by cron or internal health checks. Returns pricing, checkout, and automation readiness.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-2xl font-bold text-white">Use cases</h2>
            <div className="mt-5 grid gap-3 text-sm text-slate-300">
              {[
                "Lead enrichment from company homepages",
                "Tech stack lookup before outreach",
                "Article ingestion for AI agents",
                "Scheduled metadata checks in cron jobs",
                "Webhook-triggered URL parsing in pipelines",
                "SEO / link / content extraction for internal tools",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/20 p-4">{item}</div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-2xl font-bold text-white">Error codes</h2>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-black/20 p-4">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-slate-400">
                <tr><th className="pb-3 pr-4">Code</th><th className="pb-3 pr-4">Meaning</th><th className="pb-3">Example</th></tr>
              </thead>
              <tbody>
                {[
                  ["400", "Bad Request", "Missing url, invalid JSON, invalid plan"],
                  ["401", "Unauthorized", "Webhook or ops endpoint missing secret"],
                  ["422", "Unprocessable", "Non-HTML content type"],
                  ["429", "Rate Limited", "Too many requests in current window"],
                  ["502", "Bad Gateway", "Target URL unreachable"],
                  ["503", "Unavailable", "Checkout or webhook config missing"],
                  ["504", "Timeout", "Target took too long to respond"],
                ].map(([code, meaning, example]) => (
                  <tr key={code} className="border-t border-white/10"><td className="py-3 pr-4 font-mono">{code}</td><td className="pr-4">{meaning}</td><td>{example}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-2xl font-bold text-white">Upgrade flow</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div id="checkout-pro" className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-5">
              <p className="text-lg font-bold text-white">Pro plan checkout</p>
              <p className="mt-2 text-sm text-slate-200">Use <code className="text-white">POST /api/billing/checkout</code> with <code className="text-white">{"{"}"plan":"pro"{"}"}</code>.</p>
            </div>
            <div id="checkout-business" className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-lg font-bold text-white">Business plan checkout</p>
              <p className="mt-2 text-sm text-slate-200">Use <code className="text-white">POST /api/billing/checkout</code> with <code className="text-white">{"{"}"plan":"business"{"}"}</code>.</p>
            </div>
          </div>
        </section>

        <footer className="pb-8 text-center text-sm text-slate-500">
          WebSnap API · <a href="/" className="text-cyan-300 hover:text-cyan-200">Home</a> · <a href="https://github.com/Splaticusamz/websnap-api" className="text-cyan-300 hover:text-cyan-200">GitHub</a>
        </footer>
      </div>
    </main>
  );
}
