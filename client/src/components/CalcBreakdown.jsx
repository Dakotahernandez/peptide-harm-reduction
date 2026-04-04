import { formatNumber } from '@/lib/calculations';

export default function CalcBreakdown({ calcBreakdown, diluentMl }) {
  if (!calcBreakdown) return null;

  return (
    <div className="col-span-full rounded-xl border border-border bg-surface-alt p-3">
      <p className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-2">Calculation steps</p>
      <ol className="text-sm text-text-muted list-decimal pl-5 space-y-1">
        <li>
          Convert units: vial = {formatNumber(calcBreakdown.vialMg, 4)} mg, dose ={' '}
          {formatNumber(calcBreakdown.desiredMg, 4)} mg.
        </li>
        <li>
          Concentration = {formatNumber(calcBreakdown.vialMg, 4)} mg / {formatNumber(Number(diluentMl), 4)} mL ={' '}
          {formatNumber(calcBreakdown.concentration, 4)} mg/mL.
        </li>
        <li>
          Volume = {formatNumber(calcBreakdown.desiredMg, 4)} mg / {formatNumber(calcBreakdown.concentration, 4)} mg/mL
          = {formatNumber(calcBreakdown.doseVolumeMl, 4)} mL ({formatNumber(calcBreakdown.doseVolumeMl * 100, 1)}{' '}
          units).
        </li>
      </ol>
    </div>
  );
}
