import { useMemo } from 'react';
import PeptideCard from './PeptideCard';

export function PeptideDirectoryPanel({ peptides, loading, error, query, setQuery, onViewCitations }) {
  const filtered = useMemo(() => {
    if (!query) return peptides;
    return peptides.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.aka || []).some((alias) => alias.toLowerCase().includes(query.toLowerCase())),
    );
  }, [peptides, query]);

  return (
    <section className="rounded-2xl border border-border bg-surface p-3 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:justify-between mb-4">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-text-muted">Peptide directory</p>
          <h2 className="text-xl font-bold text-text">Profiles &amp; storage</h2>
        </div>
        <input
          type="search"
          placeholder="Search by name or alias"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-xl border border-border bg-surface-alt px-3 py-2.5 text-sm text-text placeholder:text-text-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none w-full sm:w-auto sm:min-w-[220px] transition-colors"
        />
      </div>
      {loading && <p className="text-sm text-text-muted">Loading peptide list…</p>}
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 sm:gap-4">
        {filtered.map((p) => (
          <PeptideCard key={p.id} peptide={p} onViewCitations={onViewCitations} />
        ))}
        {!loading && filtered.length === 0 && <p className="text-sm text-text-muted">No matches.</p>}
      </div>
    </section>
  );
}
