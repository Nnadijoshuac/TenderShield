"use client";

export function IssuerActions({
  canClose,
}: {
  canClose: boolean;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div className="mb-4 text-sm text-slate-300">Issuer actions are staged. Close is visible now; reveal and finalization are enabled in the next milestones.</div>
      <div className="flex flex-wrap gap-3">
        <button disabled={!canClose} className="rounded-2xl bg-slate-200 px-4 py-3 text-sm font-medium text-slate-950 disabled:opacity-50">
          Close Tender
        </button>
        <button disabled className="rounded-2xl bg-amber-300 px-4 py-3 text-sm font-medium text-slate-950 disabled:opacity-50">
          Request Reveal
        </button>
        <button disabled className="rounded-2xl bg-sky-400 px-4 py-3 text-sm font-medium text-slate-950 disabled:opacity-50">
          Finalize Tender
        </button>
      </div>
      <div className="mt-4 text-sm text-slate-400">Refund and award claims are enabled once encrypted reveal is fully wired.</div>
    </div>
  );
}
