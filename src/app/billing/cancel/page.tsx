export default function BillingCancelPage() {
  return (
    <main className="min-h-screen bg-gray-950 px-6 py-16 text-gray-100">
      <div className="mx-auto max-w-3xl rounded-3xl border border-amber-500/20 bg-amber-500/10 p-8 shadow-2xl shadow-amber-950/30">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Checkout cancelled</p>
        <h1 className="mt-3 text-4xl font-black text-white">No problem.</h1>
        <p className="mt-4 text-lg text-gray-200">
          You can still test the product on the free tier, review the API docs, and come back when you are ready to move a workflow into production.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/" className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-gray-950 transition hover:bg-amber-300">Back to pricing</a>
          <a href="/docs" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10">Read docs first</a>
        </div>
      </div>
    </main>
  );
}
