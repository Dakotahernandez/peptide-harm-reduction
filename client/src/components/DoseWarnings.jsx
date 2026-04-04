export default function DoseWarnings({ warnings }) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="col-span-full rounded-xl border border-red-200 bg-red-50 p-3" role="alert">
      <p className="text-xs font-semibold tracking-widest uppercase text-danger mb-1">Dose guardrails</p>
      <ul className="text-sm text-red-700 list-disc pl-4 space-y-0.5">
        {warnings.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
    </div>
  );
}
