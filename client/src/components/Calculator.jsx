import { useState, useRef, useEffect } from 'react';
import { SYRINGE_PROFILES } from '@/lib/constants';
import { formatNumber, computeLocalCalculation } from '@/lib/calculations';
import { fetchCalculation } from '@/lib/api';
import { useSyringe, useCalcBreakdown } from '@/hooks/useSyringe';
import SyringeVisual from './SyringeVisual';
import CalcBreakdown from './CalcBreakdown';
import DoseWarnings from './DoseWarnings';
import ReconGuide from './ReconGuide';

export default function Calculator({ setError }) {
  const [calcInput, setCalcInput] = useState({
    vial_amount: '5',
    vial_unit: 'mg',
    diluent_ml: '2',
    desired_dose: '0.25',
    desired_unit: 'mg',
  });
  const [calcResult, setCalcResult] = useState(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const guideRef = useRef(null);
  const copyTimeoutRef = useRef(null);

  const { syringeProfileId, setSyringeProfileId, selectedSyringeProfile, syringeUnits, syringeUnitsRaw, doseWarnings } =
    useSyringe(calcResult);
  const calcBreakdown = useCalcBreakdown(calcInput);

  useEffect(() => {
    const stored = localStorage.getItem('consentGiven');
    if (stored === 'true') {
      // Restore persisted consent from a previous session
      setConsentGiven(true); // eslint-disable-line react-hooks/set-state-in-effect -- reading from localStorage on mount
    }
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const handleCalcChange = (field, value) => {
    setCalcInput((prev) => ({ ...prev, [field]: value }));
  };

  const runCalc = async () => {
    setError('');
    setCalcResult(null);
    setCopyStatus('');
    try {
      const data = await fetchCalculation(calcInput);
      setCalcResult(data);
      if (guideRef.current && showGuide) {
        guideRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch {
      try {
        const local = computeLocalCalculation(calcInput);
        setCalcResult(local);
        setError('Backend unavailable; showing local-only calculation. Verify when online.');
      } catch {
        setError('Calculation failed. Ensure numbers are positive and backend is running.');
      }
    }
  };

  const copyCalculation = async () => {
    if (!calcResult || syringeUnitsRaw === null) return;
    const lines = [
      'Peptide dose calculation',
      `Vial powder: ${calcInput.vial_amount} ${calcInput.vial_unit}`,
      `Diluent: ${calcInput.diluent_ml} mL`,
      `Desired dose: ${calcInput.desired_dose} ${calcInput.desired_unit}`,
      `Concentration: ${formatNumber(calcResult.concentration_mg_per_ml, 4)} mg/mL`,
      `Pull volume: ${formatNumber(calcResult.dose_volume_ml, 4)} mL`,
      `Syringe: ${selectedSyringeProfile.label}`,
      `Syringe units (U-100): ${formatNumber(syringeUnitsRaw, 1)} units`,
    ];
    if (doseWarnings.length > 0) {
      lines.push(`Warnings: ${doseWarnings.join(' | ')}`);
    }
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopyStatus('Copied');
    } catch {
      setCopyStatus('Clipboard blocked by browser');
    }
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopyStatus(''), 2400);
  };

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex flex-wrap gap-3 items-start justify-between mb-2">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-text-muted">Dose math</p>
          <h2 className="text-xl font-bold text-text">Reconstitution Calculator</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            className="text-sm px-3 py-2 rounded-lg border border-border bg-surface-alt text-text-muted hover:text-text cursor-pointer transition-colors"
            onClick={() => window.print()}
          >
            Print
          </button>
          <button
            className="text-sm px-3 py-2 rounded-lg border border-border bg-surface-alt text-text-muted hover:text-text cursor-pointer transition-colors"
            onClick={() => setShowGuide((s) => !s)}
          >
            {showGuide ? 'Hide guide' : 'Show guide'}
          </button>
        </div>
      </div>

      <p className="text-sm text-text-muted mb-3">
        Supports mg and mcg/µg inputs. Outputs are volumetric for insulin syringes.
      </p>

      <div ref={guideRef}>
        <ReconGuide show={showGuide} />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3 mt-4">
        <label className="text-sm font-medium text-text">
          Vial powder
          <div className="grid grid-cols-[1fr_100px] gap-2 mt-1">
            <input
              type="number"
              step="0.01"
              value={calcInput.vial_amount}
              onChange={(e) => handleCalcChange('vial_amount', e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-alt px-3 py-2.5 text-sm text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
            />
            <select
              value={calcInput.vial_unit}
              onChange={(e) => handleCalcChange('vial_unit', e.target.value)}
              className="rounded-xl border border-border bg-surface-alt px-2 py-2.5 text-sm text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
            >
              <option value="mg">mg</option>
              <option value="mcg">mcg / µg</option>
            </select>
          </div>
        </label>

        <label className="text-sm font-medium text-text">
          Diluent volume (mL)
          <input
            type="number"
            step="0.01"
            value={calcInput.diluent_ml}
            onChange={(e) => handleCalcChange('diluent_ml', e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-alt px-3 py-2.5 text-sm text-text mt-1 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
          />
        </label>

        <label className="text-sm font-medium text-text">
          Desired dose
          <div className="grid grid-cols-[1fr_100px] gap-2 mt-1">
            <input
              type="number"
              step="0.01"
              value={calcInput.desired_dose}
              onChange={(e) => handleCalcChange('desired_dose', e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-alt px-3 py-2.5 text-sm text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
            />
            <select
              value={calcInput.desired_unit}
              onChange={(e) => handleCalcChange('desired_unit', e.target.value)}
              className="rounded-xl border border-border bg-surface-alt px-2 py-2.5 text-sm text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
            >
              <option value="mg">mg</option>
              <option value="mcg">mcg / µg</option>
            </select>
          </div>
        </label>

        <label className="text-sm font-medium text-text">
          Syringe type
          <select
            value={syringeProfileId}
            onChange={(e) => setSyringeProfileId(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-alt px-3 py-2.5 text-sm text-text mt-1 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
          >
            {SYRINGE_PROFILES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <label className="col-span-full flex items-center gap-2 text-sm font-semibold text-text cursor-pointer">
          <input
            type="checkbox"
            checked={consentGiven}
            onChange={(e) => {
              setConsentGiven(e.target.checked);
              localStorage.setItem('consentGiven', e.target.checked ? 'true' : 'false');
            }}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
          />
          I understand this is not medical advice.
        </label>

        <button
          onClick={runCalc}
          disabled={!consentGiven}
          className="col-span-full py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          Calculate
        </button>
      </div>

      {calcResult && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 mt-4 p-4 rounded-xl border border-border bg-surface-alt">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-text-muted">Concentration</p>
            <strong className="text-xl text-text">{formatNumber(calcResult.concentration_mg_per_ml, 4)} mg/mL</strong>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-text-muted">Dose volume</p>
            <strong className="text-xl text-text">{formatNumber(calcResult.dose_volume_ml, 4)} mL</strong>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-text-muted">Syringe units (U-100)</p>
            <strong className="text-xl text-text">
              {syringeUnitsRaw === null ? '—' : `${formatNumber(syringeUnitsRaw, 1)} u`}
            </strong>
            <p className="text-xs text-text-muted mt-0.5">{selectedSyringeProfile.label}</p>
          </div>

          {syringeUnits !== null && (
            <div className="col-span-full mt-2">
              <SyringeVisual
                selectedSyringeProfile={selectedSyringeProfile}
                syringeUnits={syringeUnits}
                syringeUnitsRaw={syringeUnitsRaw}
              />
            </div>
          )}

          <DoseWarnings warnings={doseWarnings} />
          <CalcBreakdown calcBreakdown={calcBreakdown} diluentMl={calcInput.diluent_ml} />

          <div className="col-span-full flex items-center gap-3">
            <button
              className="text-sm px-3 py-2 rounded-lg border border-border bg-surface text-text-muted hover:text-text cursor-pointer transition-colors"
              onClick={copyCalculation}
            >
              Copy result
            </button>
            {copyStatus && <span className="text-xs text-text-muted">{copyStatus}</span>}
          </div>
          <p className="col-span-full text-sm text-text-muted">{calcResult.note}</p>
        </div>
      )}
    </section>
  );
}
