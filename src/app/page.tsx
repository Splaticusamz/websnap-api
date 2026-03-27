export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          WebSnap API
        </h1>
        <p className="text-xl text-gray-400">
          URL → Structured JSON in one call.
        </p>
        <p className="text-gray-500">
          Extract titles, meta tags, content, links, images, and tech stack from any URL.
          Built for AI agents and developers.
        </p>
        <div className="bg-gray-900 rounded-lg p-4 text-left font-mono text-sm">
          <p className="text-gray-500">{"// POST /api/snap"}</p>
          <p className="text-emerald-400">{"{ \"url\": \"https://example.com\" }"}</p>
        </div>
        <div className="flex gap-4 justify-center">
          <a href="/docs" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition">
            Documentation
          </a>
          <a href="https://github.com/botsix-workspace/websnap-api" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition">
            GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
