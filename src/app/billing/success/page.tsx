export default function BillingSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-950 px-6 py-16 text-gray-100">
      <div className="mx-auto max-w-3xl rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8 shadow-2xl shadow-emerald-950/30">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Payment received</p>
        <h1 className="mt-3 text-4xl font-black text-white">Nice. You’re in the pipeline.</h1>
        <p className="mt-4 text-lg text-gray-200">
          Your checkout completed successfully. WebSnap API is set up for fast manual or automated provisioning depending on the
          current billing config.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            ["1", "Check your email / confirmation details"],
            ["2", "Map the purchase to a WebSnap plan tier"],
            ["3", "Issue or upgrade the API key"],
            ["4", "Run your first POST /api/snap request"],
          ].map(([step, copy]) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm font-semibold text-emerald-300">Step {step}</p>
              <p className="mt-1 text-sm text-gray-200">{copy}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/docs" className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-gray-950 transition hover:bg-emerald-400">Read docs</a>
          <a href="/" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10">Back home</a>
        </div>
      </div>
    </main>
  );
}
