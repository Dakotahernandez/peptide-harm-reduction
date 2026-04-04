import { useMemo } from 'react';

export default function CitationsModal({ peptide, onClose }) {
  const orderedSections = useMemo(() => {
    if (!peptide) return [];
    const safeList = (v) => (Array.isArray(v) ? v.filter(Boolean) : []);
    return [
      { label: 'Storage', facts: peptide.storage ? [peptide.storage] : [] },
      { label: 'Typical protocol', facts: safeList(peptide.typical_protocols) },
      { label: 'Notes', facts: safeList(peptide.notes) },
      { label: 'Potential benefits', facts: safeList(peptide.benefits) },
      { label: 'Known/expected side effects', facts: safeList(peptide.side_effects) },
    ].filter((s) => s.facts.length > 0);
  }, [peptide]);

  if (!peptide) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[80vh] overflow-auto rounded-2xl border border-border bg-surface shadow-xl p-5"
        role="dialog"
        aria-modal="true"
        aria-label={`Citations for ${peptide.name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-text-muted">Citations</p>
            <h2 className="text-xl font-bold text-text">{peptide.name}</h2>
          </div>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-surface-alt text-text-muted hover:text-text cursor-pointer text-lg leading-none transition-colors"
            onClick={onClose}
            aria-label="Close citations"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          {orderedSections.map((section) => (
            <div key={section.label} className="rounded-xl border border-border bg-surface-alt p-4">
              <p className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-2">{section.label}</p>
              {section.facts.map((fact) => {
                const sources = peptide.citations?.[fact] || [];
                return (
                  <div key={fact} className="mt-2">
                    <p className="text-sm font-semibold text-text mb-1">{fact}</p>
                    {sources.length === 0 ? (
                      <p className="text-sm text-text-muted">No citations provided.</p>
                    ) : (
                      <ul className="list-disc pl-4 text-sm text-text-muted space-y-0.5">
                        {sources.map((c, idx) => (
                          <li key={`${c.url}-${idx}`}>
                            <a
                              href={c.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:underline"
                            >
                              {c.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
