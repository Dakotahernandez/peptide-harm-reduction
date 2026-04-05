export default function HarmReductionCallouts() {
  return (
    <section className="rounded-2xl border border-border bg-surface p-3 sm:p-5 shadow-sm">
      <p className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-2">Harm reduction prompts</p>
      <ul className="text-sm text-text-muted space-y-2 list-disc pl-4">
        <li>
          <strong className="text-text">Labeling:</strong> include peptide name and concentration (mg/mL).
        </li>
        <li>
          <strong className="text-text">Storage:</strong> keep reconstituted vials 2–8°C, protect from light, avoid repeated freeze/thaw.
        </li>
        <li>
          <strong className="text-text">Injection hygiene:</strong> alcohol swab vial stopper and skin; new needle each entry; avoid sharing.
        </li>
        <li>
          <strong className="text-text">Observation:</strong> monitor for redness, heat, or unexpected reactions; seek emergency care for adverse events.
        </li>
        <li>
          <strong className="text-text">Disposal:</strong> use a sharps container; do not recap used needles if avoidable.
        </li>
      </ul>
    </section>
  );
}
