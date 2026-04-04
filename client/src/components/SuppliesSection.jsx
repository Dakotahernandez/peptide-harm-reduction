import { SUPPLIES, SUPPLIER_LINKS } from '@/lib/affiliates';

export default function SuppliesSection() {
  const activeSupplierLinks = SUPPLIER_LINKS.filter((s) => s.href);

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <p className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-1">Reference</p>
      <h2 className="text-xl font-bold text-text mb-4">Recommended Supplies</h2>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
        {SUPPLIES.map((item) => (
          <div key={item.name} className="rounded-xl border border-border bg-surface-alt p-4">
            <h3 className="font-semibold text-sm text-text mb-1">{item.name}</h3>
            <p className="text-sm text-text-muted">{item.description}</p>
          </div>
        ))}
      </div>

      {activeSupplierLinks.length > 0 && (
        <>
          <h3 className="text-lg font-bold text-text mt-6 mb-3">Supplier Links</h3>
          <p className="text-xs text-text-muted mb-3">
            Links marked with * are affiliate links. See disclosure above.
          </p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
            {activeSupplierLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="block rounded-xl border border-border bg-surface-alt p-4 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <h4 className="font-semibold text-sm text-primary mb-1">{link.name} *</h4>
                <p className="text-sm text-text-muted">{link.description}</p>
              </a>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
