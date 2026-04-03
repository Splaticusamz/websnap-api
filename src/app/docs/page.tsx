import { CheckoutCta } from "@/components/checkout-cta";
import { formatPlanPrice, getPlanEntries } from "@/lib/plans";

const plans = getPlanEntries();

const examples = [
  {
    title: "Lead enrichment",
    goal: "Pull company-site metadata and tech stack before outbound or qualification.",
    request: `curl -X POST https://websnap-api.vercel.app/api/snap \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: your_key_here" \\
  -d '{
    "url": "https://vercel.com",
    "options": {
      "includeContent": true,
      "includeTechStack": true,
      "includePerformance": true
    }
  }'`,
    result: `{
  "title": "Vercel",
  "description": "Develop. Preview. Ship.",
  "techStack": [{ "name": "Next.js", "confidence": "high" }],
  "performance": { "statusCode": 200 }
}`,
  },
  {
    title: "Docs ingestion for agents",
    goal: "Turn public docs or blog pages into clean content blocks for retrieval and agent context.",
    request: `{
  "url": "https://nextjs.org/docs",
  "options": {
    "includeContent": true,
    "includeTechStack": false,
    "includePerformance": false
  }
}`,
    result: `{
  "title": "Next.js Documentation",
  "mainContent": "Next.js Documentation...",
  "links": [{ "href": "https://nextjs.org/docs/app" }]
}`,
  },
  {
    title: "SEO + metadata QA",
    goal: "Collect OG tags, Twitter cards, canonicals, links, and images in a single response.",
    request: `response.ogTags.title
response.twitterCard.card
response.canonical
response.images`,
    result: `Use the same /api/snap call; inspect metadata fields for QA dashboards or scheduled checks.`,
  },
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-gray-950 px-6 py-10 text-gray-100">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <a href="/" className="text-sm text-cyan-300 hover:text-cyan-200">← Back to home</a>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black text-white">WebSnap API docs</h1>
              <p className="mt-3 max-w-3xl text-slate-300">
                One endpoint, fast setup, structured output. Use it for AI agents, scheduled jobs, webhook-triggered workflows,
                lead enrichment, and metadata extraction from public webpages.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <a href="#quickstart" className="rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-gray-950 hover:bg-cyan-300">Start with curl</a>
              <a href="#plans" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white hover:bg-white/10">Plans + upgrade</a>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">POST /api/snap</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">GET /api/health</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">POST /api/billing/checkout</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">POST /api/billing/webhook</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">GET /api/ops/status</span>
          </div>
        </div>

        <section id="quickstart" className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Quick start</h2>
              <p className="mt-1 text-sm text-slate-400">Send one request, inspect the JSON, then decide whether you need a paid tier.</p>
            </div>
            <p className="text-sm text-emerald-300">No dashboard maze. No SDK required.</p>
          </div>
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

        <section id="examples" className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Credible use-case examples</h2>
              <p className="text-sm text-slate-400">Examples that map directly to buying intent: agents, enrichment, and metadata operations.</p>
            </div>
            <a href="/dashboard" className="text-sm font-medium text-cyan-300 hover:text-cyan-200">Operator dashboard →</a>
          </div>
          <div className="mt-5 grid gap-4 xl:grid-cols-3">
            {examples.map((example) => (
              <div key={example.title} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <h3 className="font-semibold text-white">{example.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{example.goal}</p>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Request</p>
                    <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-[#020617] p-4 text-xs leading-6 text-cyan-100">{example.request}</pre>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Result</p>
                    <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-[#020617] p-4 text-xs leading-6 text-emerald-200">{example.result}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="plans" className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Rate limits and plans</h2>
              <p className="text-sm text-slate-400">Response headers expose plan and remaining quota so operators can see what is happening right now.</p>
            </div>
            <p className="text-sm text-slate-400">
              Headers: <code className="text-slate-200">X-RateLimit-Limit</code>, <code className="text-slate-200">X-RateLimit-Remaining</code>, <code className="text-slate-200">X-RateLimit-Reset</code>, <code className="text-slate-200">X-RateLimit-Plan</code>, <code className="text-slate-200">X-RateLimit-Window</code>
            </p>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.key} className={`rounded-2xl border p-5 ${plan.key === "pro" ? "border-cyan-400/30 bg-cyan-500/10" : "border-white/10 bg-black/20"}`}>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{plan.name}</p>
                <p className="mt-2 text-3xl font-black text-white">{formatPlanPrice(plan.key)}</p>
                <p className="mt-2 text-sm text-slate-300">{plan.monthlyRequests.toLocaleString()} monthly · {plan.burstPerMinute}/min burst</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-200">
                  {plan.features.map((feature) => <li key={feature}>• {feature}</li>)}
                </ul>
                <div className="mt-5">
                  {plan.key === "free" ? (
                    <a href="/" className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white hover:bg-white/10">Start free</a>
                  ) : (
                    <CheckoutCta
                      plan={plan.key}
                      label={plan.cta}
                      className={`inline-flex rounded-xl px-4 py-3 font-semibold transition ${plan.key === "pro" ? "bg-cyan-400 text-gray-950 hover:bg-cyan-300" : "border border-white/10 bg-white/5 text-white hover:bg-white/10"}`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-2xl font-bold text-white">Automation endpoints</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-semibold text-white">POST /api/billing/checkout</p>
                <p className="mt-2">Send <code className="text-slate-200">{"{"}"plan":"pro"{"}"}</code> or <code className="text-slate-200">{"{"}"plan":"business"{"}"}</code> to resolve the current checkout target.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-semibold text-white">POST /api/billing/webhook</p>
                <p className="mt-2">Webhook receiver for billing automation. Supports shared-secret validation and returns plan-mapping/provisioning guidance.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-semibold text-white">GET /api/ops/status</p>
                <p className="mt-2">Protected ops snapshot endpoint used by cron or internal checks. Now includes onboarding readiness, checkout coverage, key inventory, and recent usage-window visibility.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
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
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-2xl font-bold text-white">Language examples</h2>
          <p className="mt-2 text-sm text-slate-400">WebSnap API is a plain HTTP endpoint — call it from any language with no SDK required.</p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold text-cyan-300">Python (requests)</p>
              <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-[#020617] p-4 text-xs leading-6 text-slate-200">{`import requests

response = requests.post(
    "https://websnap-api.vercel.app/api/snap",
    headers={
        "Content-Type": "application/json",
        "x-api-key": "your_key_here",
    },
    json={
        "url": "https://stripe.com",
        "options": {
            "includeContent": True,
            "includeTechStack": True,
        }
    }
)
data = response.json()
print(data["title"])          # "Stripe"
print(data["techStack"])      # [{"name": "React", ...}]
print(data["ogTags"]["title"])# OG title tag`}</pre>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-cyan-300">Node.js (fetch)</p>
              <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-[#020617] p-4 text-xs leading-6 text-slate-200">{`const response = await fetch(
  "https://websnap-api.vercel.app/api/snap",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "your_key_here",
    },
    body: JSON.stringify({
      url: "https://vercel.com",
      options: {
        includeContent: true,
        includeTechStack: true,
        includePerformance: true,
      },
    }),
  }
);
const data = await response.json();
console.log(data.title);         // "Vercel"
console.log(data.links.length);  // number of links found`}</pre>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-cyan-300">LangChain / AI agent tool</p>
              <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-[#020617] p-4 text-xs leading-6 text-slate-200">{`from langchain.tools import tool
import requests

@tool
def websnap(url: str) -> dict:
    """Fetch structured metadata from a webpage URL."""
    r = requests.post(
        "https://websnap-api.vercel.app/api/snap",
        headers={"x-api-key": "your_key_here"},
        json={"url": url, "options": {"includeContent": True}}
    )
    return r.json()

# Now pass to any LangChain agent
# agent.run("What does stripe.com do?", tools=[websnap])`}</pre>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-cyan-300">n8n / Make.com HTTP node</p>
              <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-[#020617] p-4 text-xs leading-6 text-slate-200">{`Method:  POST
URL:     https://websnap-api.vercel.app/api/snap
Headers:
  Content-Type: application/json
  x-api-key:    {{$credentials.websnap_key}}

Body (JSON):
{
  "url": "{{ $json.lead_website }}",
  "options": {
    "includeContent": true,
    "includeTechStack": true
  }
}

# Map outputs to your CRM fields:
# data.title       → Company Name
# data.description → Company Description
# data.techStack   → Tech Stack Tags`}</pre>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-2xl font-bold text-white">FAQ</h2>
          <div className="mt-6 space-y-6 text-sm text-slate-300">
            {[
              {
                q: "What does WebSnap API actually return?",
                a: "A structured JSON object with title, description, headings, Open Graph tags, Twitter card data, canonical URL, all links, images, JSON-LD structured data, tech stack detection, and optional full page content. Everything from one HTTP call.",
              },
              {
                q: "Does it render JavaScript / SPAs?",
                a: "Yes. WebSnap uses a headless rendering pipeline that executes JavaScript, so React, Next.js, Vue, and Angular apps return full content — not just the blank HTML shell.",
              },
              {
                q: "Is there a free tier?",
                a: "Yes. You can use WebSnap API without an API key for a limited number of requests per day. Add a key to unlock higher limits and paid plan tiers.",
              },
              {
                q: "How fast is it?",
                a: "Median response time is under 2 seconds for most pages. Complex SPAs or slow targets may take up to 8 seconds. The API times out at 15 seconds and returns a 504.",
              },
              {
                q: "Can I use it in a cron job or scheduled pipeline?",
                a: "Yes — it's a stateless HTTP endpoint. Any scheduler (Vercel Cron, GitHub Actions, n8n, Zapier) can call it on a schedule. Use a paid plan for higher rate limits in automated pipelines.",
              },
              {
                q: "Does it work with auth-gated pages?",
                a: "No — WebSnap API only fetches publicly accessible pages. It doesn't support login, cookies, or session tokens.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="font-semibold text-white">{q}</p>
                <p className="mt-2 text-slate-400">{a}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="pb-8 text-center text-sm text-slate-500">
          WebSnap API · <a href="/" className="text-cyan-300 hover:text-cyan-200">Home</a> · <a href="https://github.com/Splaticusamz/websnap-api" className="text-cyan-300 hover:text-cyan-200">GitHub</a>
        </footer>
      </div>
    </main>
  );
}
