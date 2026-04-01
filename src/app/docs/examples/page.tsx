import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Usage Examples — WebSnap API",
  description:
    "Practical code examples for WebSnap API: Node.js, Python, cURL, AI agent integration, batch processing, and webhook workflows.",
};

const codeExamples = [
  {
    lang: "Node.js (fetch)",
    code: `const res = await fetch("https://websnap-api.vercel.app/api/snap", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.WEBSNAP_API_KEY,
  },
  body: JSON.stringify({
    url: "https://stripe.com",
    options: { includeContent: true, includeTechStack: true },
  }),
});

const data = await res.json();
console.log(data.title, data.techStack);`,
  },
  {
    lang: "Python (requests)",
    code: `import requests, os

resp = requests.post(
    "https://websnap-api.vercel.app/api/snap",
    headers={
        "Content-Type": "application/json",
        "x-api-key": os.environ["WEBSNAP_API_KEY"],
    },
    json={
        "url": "https://stripe.com",
        "options": {"includeContent": True, "includeTechStack": True},
    },
)

data = resp.json()
print(data["title"], data.get("techStack", []))`,
  },
  {
    lang: "AI Agent — LangChain Tool",
    code: `import { DynamicTool } from "langchain/tools";

const webSnapTool = new DynamicTool({
  name: "web_snap",
  description: "Extract structured metadata from any public URL",
  func: async (url: string) => {
    const res = await fetch("https://websnap-api.vercel.app/api/snap", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": KEY },
      body: JSON.stringify({ url, options: { includeContent: true } }),
    });
    return JSON.stringify(await res.json());
  },
});`,
  },
  {
    lang: "Batch Processing (Node.js)",
    code: `const urls = [
  "https://vercel.com",
  "https://supabase.com",
  "https://linear.app",
];

const results = [];
for (const url of urls) {
  const res = await fetch("https://websnap-api.vercel.app/api/snap", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": KEY },
    body: JSON.stringify({ url, options: { includeTechStack: true } }),
  });
  results.push(await res.json());
  // Respect rate limits — add delay between requests
  await new Promise((r) => setTimeout(r, 1000));
}

console.table(results.map((r) => ({
  url: r.url,
  title: r.title,
  stack: r.techStack?.map((t) => t.name).join(", "),
})));`,
  },
  {
    lang: "cURL — Minimal Request",
    code: `curl -s -X POST https://websnap-api.vercel.app/api/snap \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://github.com"}' | jq .title`,
  },
];

export default function ExamplesPage() {
  return (
    <main className="min-h-screen bg-gray-950 px-6 py-10 text-gray-100">
      <div className="mx-auto max-w-4xl space-y-10">
        <div>
          <a href="/docs" className="text-sm text-cyan-300 hover:text-cyan-200">
            ← Back to docs
          </a>
          <h1 className="mt-4 text-4xl font-black text-white">Code Examples</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Copy-paste examples for every common integration pattern. All
            examples use the <code className="text-cyan-200">POST /api/snap</code> endpoint.
          </p>
        </div>

        {codeExamples.map((ex) => (
          <section
            key={ex.lang}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-8"
          >
            <h2 className="text-xl font-bold text-white">{ex.lang}</h2>
            <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-[#020617] p-5 text-sm leading-7 text-slate-200">
              {ex.code}
            </pre>
          </section>
        ))}

        <section className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-8 text-center">
          <h2 className="text-2xl font-semibold text-white">
            Ready to integrate?
          </h2>
          <p className="mt-2 text-slate-300">
            Start with the free tier — no credit card, no SDK, just an HTTP
            POST.
          </p>
          <a
            href="/docs"
            className="mt-4 inline-block rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-gray-950"
          >
            Read the full docs
          </a>
        </section>
      </div>
    </main>
  );
}
