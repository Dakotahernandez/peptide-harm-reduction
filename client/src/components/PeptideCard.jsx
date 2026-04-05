import PurchaseOptions from './PurchaseOptions';

export default function PeptideCard({ peptide, onViewCitations }) {
  return (
    <article className="rounded-xl border border-border bg-surface p-3 sm:p-4 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-150">
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-widest uppercase text-text-muted">{peptide.category}</p>
          <h3 className="font-semibold text-text text-lg">{peptide.name}</h3>
          {peptide.aka?.length > 0 && (
            <p className="text-sm text-text-muted">aka {peptide.aka.join(', ')}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 border border-blue-200 text-primary">
            {peptide.vial_amount_mg} mg vial
          </span>
          <button
            className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-border bg-surface-alt hover:border-primary/40 cursor-pointer transition-colors"
            onClick={() => onViewCitations(peptide)}
          >
            View citations
          </button>
        </div>
      </div>

      <dl className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-x-3 gap-y-1 mt-3">
        <div>
          <dt className="text-xs text-text-muted">Diluent</dt>
          <dd className="text-sm text-text">{peptide.typical_diluent_ml} mL suggested</dd>
        </div>
        <div>
          <dt className="text-xs text-text-muted">Storage</dt>
          <dd className="text-sm text-text">{peptide.storage}</dd>
        </div>
        {peptide.typical_protocols?.length > 0 && (
          <div>
            <dt className="text-xs text-text-muted">Typical protocol</dt>
            <dd className="text-sm text-text">{peptide.typical_protocols.join(', ')}</dd>
          </div>
        )}
      </dl>

      <div className="mt-3 p-3 rounded-lg border border-border bg-surface-alt">
        <p className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-1">Potential benefits</p>
        <ul className="text-sm text-text-muted list-disc pl-4 space-y-0.5">
          {peptide.benefits?.map((b, idx) => <li key={idx}>{b}</li>)}
        </ul>
      </div>

      <div className="mt-2 p-3 rounded-lg border border-red-200 bg-red-50/50">
        <p className="text-xs font-semibold tracking-widest uppercase text-danger mb-1">Known/expected side effects</p>
        <ul className="text-sm text-text-muted list-disc pl-4 space-y-0.5">
          {peptide.side_effects?.map((s, idx) => <li key={idx}>{s}</li>)}
        </ul>
      </div>

      <ul className="mt-2 text-sm text-text-muted list-disc pl-4 space-y-0.5">
        {peptide.notes.map((n, idx) => <li key={idx}>{n}</li>)}
      </ul>

      <PurchaseOptions peptideName={peptide.name} />
    </article>
  );
}
