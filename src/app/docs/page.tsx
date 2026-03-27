export default function DocsPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <a href="/" className="text-blue-400 hover:underline text-sm">← Back to Home</a>
          <h1 className="text-4xl font-bold mt-4">API Documentation</h1>
          <p className="text-gray-400 mt-2">WebSnap API v1.0 — Full reference</p>
        </div>

        {/* Endpoint */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Endpoint</h2>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <code className="text-emerald-400 font-mono text-lg">POST /api/snap</code>
          </div>
        </section>

        {/* Request */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Request</h2>
          <h3 className="text-lg font-semibold text-gray-300">Headers</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-400 border-b border-gray-800">
                <th className="pb-2 pr-4">Header</th><th className="pb-2 pr-4">Required</th><th className="pb-2">Description</th>
              </tr></thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-800/50"><td className="py-2 pr-4 font-mono text-sm">Content-Type</td><td className="pr-4">Yes</td><td>application/json</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-sm">x-api-key</td><td className="pr-4">No</td><td>API key for higher rate limits</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-gray-300">Body</h3>
          <pre className="bg-gray-900 rounded-lg p-4 border border-gray-800 text-sm overflow-x-auto">
{`{
  "url": "https://example.com",       // Required
  "options": {                          // Optional
    "includeContent": true,             // Main text extract (default: true)
    "includeTechStack": true,           // Tech detection (default: true)
    "includePerformance": true          // Timing data (default: true)
  }
}`}
          </pre>
        </section>

        {/* Response */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Response</h2>
          <pre className="bg-gray-900 rounded-lg p-4 border border-gray-800 text-sm overflow-x-auto text-emerald-400">
{`{
  "url": "https://example.com",
  "title": "Example Domain",
  "description": "This domain is for use in illustrative examples...",
  "canonical": "https://example.com",
  "favicon": "https://example.com/favicon.ico",
  "ogTags": {
    "title": "Example Domain",
    "description": "...",
    "image": "https://example.com/og.png",
    "type": "website",
    "url": "https://example.com",
    "siteName": "Example"
  },
  "twitterCard": {
    "card": "summary_large_image",
    "title": "Example Domain",
    "description": "...",
    "image": "https://example.com/twitter.png"
  },
  "links": [
    { "href": "https://www.iana.org/domains/example", "text": "More information...", "isExternal": true }
  ],
  "images": [
    { "src": "https://example.com/logo.png", "alt": "Logo", "width": "200", "height": "50" }
  ],
  "meta": {
    "language": "en",
    "charset": "utf-8",
    "viewport": "width=device-width, initial-scale=1",
    "robots": "index, follow"
  },
  "mainContent": "This domain is for use in illustrative examples in documents...",
  "techStack": [
    { "name": "Cloudflare", "confidence": "high", "evidence": "Cloudflare headers" }
  ],
  "performance": {
    "fetchTimeMs": 142,
    "contentLength": 1256,
    "statusCode": 200
  }
}`}
          </pre>
        </section>

        {/* Rate Limits */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Rate Limits</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-400 border-b border-gray-800">
                <th className="pb-2 pr-4">Tier</th><th className="pb-2 pr-4">Requests</th><th className="pb-2 pr-4">Window</th><th className="pb-2">Auth</th>
              </tr></thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-800/50"><td className="py-2 pr-4">Free</td><td className="pr-4">100</td><td className="pr-4">15 min</td><td>None needed</td></tr>
                <tr className="border-b border-gray-800/50"><td className="py-2 pr-4">Pro</td><td className="pr-4">1,000</td><td className="pr-4">15 min</td><td>x-api-key</td></tr>
                <tr><td className="py-2 pr-4">Business</td><td className="pr-4">5,000</td><td className="pr-4">15 min</td><td>x-api-key</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-500 text-sm">Rate limit headers: <code className="text-gray-400">X-RateLimit-Limit</code>, <code className="text-gray-400">X-RateLimit-Remaining</code>, <code className="text-gray-400">X-RateLimit-Reset</code></p>
        </section>

        {/* Error Codes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Error Codes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-400 border-b border-gray-800">
                <th className="pb-2 pr-4">Code</th><th className="pb-2 pr-4">Meaning</th><th className="pb-2">Example</th>
              </tr></thead>
              <tbody className="text-gray-300">
                {[
                  ["400", "Bad Request", "Missing url, invalid JSON"],
                  ["422", "Unprocessable", "Non-HTML content type"],
                  ["429", "Rate Limited", "Too many requests"],
                  ["502", "Bad Gateway", "Target URL unreachable"],
                  ["504", "Timeout", "Target took > 10s"],
                  ["500", "Server Error", "Internal failure"],
                ].map(([code, meaning, example]) => (
                  <tr key={code} className="border-b border-gray-800/50">
                    <td className="py-2 pr-4 font-mono">{code}</td>
                    <td className="pr-4">{meaning}</td>
                    <td className="text-gray-500">{example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Code Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Code Examples</h2>

          <h3 className="text-lg font-semibold text-gray-300">cURL</h3>
          <pre className="bg-gray-900 rounded-lg p-4 border border-gray-800 text-sm overflow-x-auto">
{`curl -X POST https://websnap-api.vercel.app/api/snap \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: your_key_here" \\
  -d '{"url": "https://github.com"}'`}
          </pre>

          <h3 className="text-lg font-semibold text-gray-300">Python</h3>
          <pre className="bg-gray-900 rounded-lg p-4 border border-gray-800 text-sm overflow-x-auto">
{`import requests

resp = requests.post(
    "https://websnap-api.vercel.app/api/snap",
    json={"url": "https://github.com"},
    headers={"x-api-key": "your_key_here"}
)
data = resp.json()
print(data["title"])
print(data["techStack"])`}
          </pre>

          <h3 className="text-lg font-semibold text-gray-300">JavaScript / TypeScript</h3>
          <pre className="bg-gray-900 rounded-lg p-4 border border-gray-800 text-sm overflow-x-auto">
{`const res = await fetch("https://websnap-api.vercel.app/api/snap", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "your_key_here",
  },
  body: JSON.stringify({ url: "https://github.com" }),
});
const data = await res.json();
console.log(data.title, data.techStack);`}
          </pre>
        </section>

        <footer className="text-center text-gray-600 text-sm py-8 border-t border-gray-800">
          WebSnap API · <a href="/" className="text-blue-400 hover:underline">Home</a> · <a href="https://github.com/botsix-workspace/websnap-api" className="text-blue-400 hover:underline">GitHub</a>
        </footer>
      </div>
    </main>
  );
}
