export default function ReconGuide({ show }) {
  if (!show) return null;

  return (
    <div className="mt-3">
      <div className="rounded-xl border border-border bg-surface-alt p-4">
        <p className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-1">Reconstitution guide</p>
        <h3 className="font-semibold text-text mb-3">Step-by-step</h3>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-1">Supplies</p>
            <ul className="text-sm text-text-muted list-disc pl-4 space-y-1">
              <li>Lyophilized peptide vial</li>
              <li>Bacteriostatic water (BAC) or supplier-recommended diluent</li>
              <li>Alcohol pads (70% IPA)</li>
              <li>Insulin syringes (1 mL / 100 u) + 18–23G draw needle</li>
              <li>Sterile mixing syringe (3–5 mL) optional</li>
              <li>Labels + fine marker; sharps container</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-1">Steps</p>
            <ol className="text-sm text-text-muted list-decimal pl-4 space-y-1">
              <li>Wash hands; clean surface.</li>
              <li>Swab peptide vial stopper and diluent vial; let dry.</li>
              <li>Pull desired diluent volume (e.g., 2.0 mL) with mixing syringe.</li>
              <li>Insert needle into peptide vial; slowly drip diluent down the glass wall (avoid foaming).</li>
              <li>Let dissolve; gently swirl—do not shake hard.</li>
              <li>Label vial with peptide name and concentration (mg/mL).</li>
              <li>Refrigerate 2–8°C; protect from light.</li>
            </ol>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-danger mb-1">Red flags</p>
            <ul className="text-sm text-red-600 list-disc pl-4 space-y-1">
              <li>Cloudiness, particles, color change &rarr; discard.</li>
              <li>Cracked stopper, leaking vial &rarr; discard.</li>
              <li>Unusual odor or precipitate after mixing &rarr; discard.</li>
              <li>Break sterility (touched needle, non-sterile water) &rarr; discard and restart.</li>
              <li>Adverse reactions (heat, redness, systemic symptoms) &rarr; stop and seek medical care.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
