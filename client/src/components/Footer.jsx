export default function Footer({ disclaimer, legalFooter }) {
  return (
    <footer className="mt-4 sm:mt-6 rounded-2xl border border-border bg-surface p-3 sm:p-5 shadow-sm">
      <p className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-1">Legal</p>
      <h3 className="font-semibold text-text mb-2">Disclaimer</h3>
      {disclaimer?.body && (
        <p className="text-sm text-text-muted mb-3 max-w-4xl">{disclaimer.body}</p>
      )}
      <ul className="text-sm text-text-muted space-y-1.5 list-disc pl-4">
        {legalFooter.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </footer>
  );
}
