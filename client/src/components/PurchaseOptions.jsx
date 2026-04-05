import { useState } from 'react';
import { PEPTIDE_SUPPLIERS } from '@/lib/affiliates';

function getSuppliersForPeptide(peptideName) {
  const key = peptideName.toLowerCase();
  // Check for exact match, then partial match, then default
  if (PEPTIDE_SUPPLIERS[key]?.length) return PEPTIDE_SUPPLIERS[key];
  const partial = Object.entries(PEPTIDE_SUPPLIERS).find(
    ([k, v]) => k !== 'default' && key.includes(k) && v.length,
  );
  if (partial) return partial[1];
  return PEPTIDE_SUPPLIERS.default || [];
}

export default function PurchaseOptions({ peptideName }) {
  const [expanded, setExpanded] = useState(false);
  const suppliers = getSuppliersForPeptide(peptideName);

  return (
    <div className="mt-3 border-t border-border pt-3">
      <button
        onClick={() => setExpanded((s) => !s)}
        className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary hover:text-primary-dark cursor-pointer transition-colors w-full"
      >
        <span>{expanded ? '▾' : '▸'}</span>
        <span>Where to purchase</span>
      </button>

      {expanded && (
        <div className="mt-2">
          {suppliers.length === 0 ? (
            <p className="text-sm text-text-muted italic">
              Supplier links coming soon. All products shown are for research purposes only.
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-text-muted">
                Research suppliers — verify purity certificates (CoA) before use. Affiliate links marked with *.
              </p>
              {suppliers.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-border bg-surface-alt hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-primary">{s.name} *</span>
                    {s.note && <p className="text-xs text-text-muted mt-0.5">{s.note}</p>}
                  </div>
                  <span className="shrink-0 text-xs font-medium text-text-muted">View →</span>
                </a>
              ))}
            </div>
          )}
          <p className="text-xs text-text-light mt-2">
            For research purposes only. Not for human consumption.
          </p>
        </div>
      )}
    </div>
  );
}
