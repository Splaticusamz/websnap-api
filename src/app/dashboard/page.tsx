import { getOperatorSnapshot } from "@/lib/operator";
import { formatPlanPrice, getPlanEntries } from "@/lib/plans";

function statusPill(status: string) {
  if (status === "done") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  if (status === "needs-config") return "border-amber-500/30 bg-amber-500/10 text-amber-300";
  return "border-slate-500/20 bg-slate-500/10 text-slate-300";
}

export default function DashboardPage() {
  const snapshot = getOperatorSnapshot();
  const plans = getPlanEntries();
  const topUsage = snapshot.usage.entries.slice(0, 6);
  const launchReadiness = Math.round(
    (snapshot.onboardingChecklist.filter((item) => item.status === "done").length / snapshot.onboardingChecklist.length) * 100
  );

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-10 text-gray-100">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-cyan-500/20 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,1))] p-8 shadow-2xl shadow-cyan-950/20">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Operator dashboard</p>
              <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">WebSnap monetization + ops cockpit</h1>
              <p className="mt-4 max-w-3xl text-slate-300">
                Current plan packaging, checkout readiness, signed-key provisioning, seeded keys, and in-memory usage visibility for the live MVP.
                This is intentionally lightweight: enough signal to operate and sell the product without adding a database first.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Launch readiness</p>
                <p className="mt-2 text-2xl font-black text-emerald-300">{launchReadiness}%</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Enabled keys</p>
                <p className="mt-2 text-2xl font-black text-white">{snapshot.apiKeys.enabled}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Active subjects</p>
                <p className="mt-2 text-2xl font-black text-white">{snapshot.usage.activeSubjects}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-slate-400">Webhook mode</p>
                <p className="mt-2 text-lg font-black text-white">{snapshot.webhookMode}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 col-span-2 sm:col-span-4">
                <p className="text-slate-400">Provisioning mode</p>
                <p className="mt-2 text-lg font-black text-cyan-300">{snapshot.provisioningMode}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Plan packaging and conversion path</h2>
                <p className="mt-1 text-sm text-slate-400">What a buyer sees, what ops needs, and whether checkout is actually wired.</p>
              </div>
              <a href="/docs" className="text-sm font-medium text-cyan-300 hover:text-cyan-200">Docs →</a>
            </div>
            <div className="mt-5 grid gap-4 xl:grid-cols-3">
              {plans.map((plan) => {
                const configured = plan.key === "free" ? true : snapshot.checkoutConfigured[plan.key];
                return (
                  <div key={plan.key} className={`rounded-2xl border p-5 ${plan.key === "pro" ? "border-cyan-400/30 bg-cyan-500/10" : "border-white/10 bg-black/20"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{plan.name}</p>
                        <p className="mt-2 text-3xl font-black text-white">{formatPlanPrice(plan.key)}</p>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-medium ${configured ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-amber-500/30 bg-amber-500/10 text-amber-300"}`}>
                        {configured ? "checkout ready" : "needs config"}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-300">{plan.monthlyRequests.toLocaleString()} requests/month · {plan.burstPerMinute}/min burst</p>
                    <ul className="mt-4 space-y-2 text-sm text-slate-200">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex gap-2"><span className="text-emerald-300">✓</span><span>{feature}</span></li>
                      ))}
                    </ul>
                    <p className="mt-4 text-xs text-slate-500">CTA: {plan.cta}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-bold text-white">Launch checklist</h2>
            <div className="mt-5 space-y-3">
              {snapshot.onboardingChecklist.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-200">{item.label}</p>
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusPill(item.status)}`}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-bold text-white">Seeded API key inventory</h2>
            <p className="mt-1 text-sm text-slate-400">Masked seeded keys only. Signed stateless keys can be issued on demand via the ops provisioning endpoint.</p>
            <div className="mt-5 space-y-3">
              {snapshot.apiKeys.inventory.map((key) => (
                <div key={`${key.maskedKey}-${key.name}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{key.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{key.maskedKey} · {key.createdAt ?? "seeded locally"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-300">{key.tier}</p>
                      <p className={`text-xs ${key.enabled ? "text-emerald-300" : "text-rose-300"}`}>{key.enabled ? "enabled" : "disabled"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Recent usage window</h2>
                <p className="mt-1 text-sm text-slate-400">In-memory rate-limit activity. Resets on restart; still useful for lightweight operator signal.</p>
              </div>
              <p className="text-xs text-slate-500">Generated {new Date(snapshot.generatedAt).toLocaleString()}</p>
            </div>
            {topUsage.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-sm text-slate-400">
                No recent traffic in memory yet. Once requests hit the API, active IPs and API keys show up here with current-window utilization.
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {topUsage.map((entry) => (
                  <div key={`${entry.type}-${entry.maskedSubject}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-white">{entry.label}</p>
                        <p className="mt-1 text-xs text-slate-500">{entry.maskedSubject} · {entry.tier} · resets {new Date(entry.resetAt).toLocaleTimeString()}</p>
                      </div>
                      <div className="text-right text-sm text-slate-300">
                        <p>{entry.windowRequests}/{entry.windowLimit} in current window</p>
                        <p className="text-xs text-slate-500">{entry.remaining} remaining</p>
                      </div>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-2 rounded-full bg-cyan-400" style={{ width: `${entry.utilizationPct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-bold text-white">What shipped in this tranche</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Self-serve onboarding", "Homepage and docs now lean harder into try-it, examples, and direct upgrade paths."],
              ["Checkout UX", "Paid plan CTAs can hit the checkout resolver and tell operators exactly what is configured."],
              ["Usage visibility", "Operator surfaces now show masked key inventory and live current-window usage without a DB."],
              ["Signed key provisioning", "Ops can now mint verifiable stateless API keys instantly without adding a database."],
              ["Operator tooling", "Ops status endpoint now returns onboarding readiness, plan coverage, keys, provisioning mode, and recent usage snapshot."],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
