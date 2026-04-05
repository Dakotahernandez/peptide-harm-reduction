export default function Header({ disclaimer, offlineMode }) {
  return (
    <header className="mb-4 sm:mb-8">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6">
        <div className="flex-1">
          <p className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-1">
            Harm Reduction &bull; Research Only
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text leading-tight mb-2 sm:mb-3">
            Peptide Reconstitution &amp; Dosing Math
          </h1>
          <p className="text-text-muted max-w-2xl mb-3">
            Practical calculations, storage reminders, and labeling prompts to reduce preventable mistakes. No medical advice. Always consult qualified professionals.
          </p>
          <div className="flex flex-wrap gap-2">
            {disclaimer?.title && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-surface-raised border border-border text-text-muted">
                {disclaimer.title}
              </span>
            )}
            {offlineMode && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-red-50 border border-red-200 text-danger">
                Offline demo — calculations run locally.
              </span>
            )}
          </div>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-3 sm:p-5 shadow-sm lg:max-w-xs w-full">
          <h3 className="font-semibold text-sm text-text mb-2">Safety checklist</h3>
          <ul className="text-sm text-text-muted space-y-1.5 list-disc pl-4">
            <li>Label vials with peptide name and concentration.</li>
            <li>Use bacteriostatic/sterile water; never tap water.</li>
            <li>Wipe stoppers with alcohol; use new needles.</li>
            <li>Discard cloudy or particulate solutions.</li>
          </ul>
        </div>
      </div>
    </header>
  );
}
