import { useEffect, useMemo, useState, useRef } from 'react';
import './App.css';

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.PROD ? 'https://api.reconstitutionsafety.com' : 'http://localhost:8000');

const SYRINGE_PROFILES = [
  { id: 'u100-1ml', label: 'U-100 1.0 mL (100 units)', max_ml: 1, max_units: 100, major_tick_units: 10 },
  { id: 'u100-05ml', label: 'U-100 0.5 mL (50 units)', max_ml: 0.5, max_units: 50, major_tick_units: 10 },
  { id: 'u100-03ml', label: 'U-100 0.3 mL (30 units)', max_ml: 0.3, max_units: 30, major_tick_units: 5 },
];

const DEFAULT_LEGAL_FOOTER = [
  'This site and its calculators are provided for educational and harm-reduction purposes only. They are not medical advice, diagnosis, or treatment.',
  'No clinician-patient relationship is created. Consult a licensed clinician for personalized guidance.',
  'If you think you may be experiencing a medical emergency, call 911 (US) or your local emergency number.',
  'Information may be incomplete or incorrect and can change over time. You are responsible for verifying units, concentration, sterility, and legality before acting.',
  'External links and citations are provided for reference only. The operators do not control or endorse third-party content.',
  "The site is provided 'as-is' without warranties. To the maximum extent permitted by law, the operators disclaim liability for any injury, loss, or damages arising from use of this site.",
];

const OFFLINE_PEPTIDES = [
  {
    id: 'demo-bpc',
    name: 'BPC-157',
    aka: ['Body Protection Compound'],
    category: 'Protective peptide',
    vial_amount_mg: 5,
    typical_diluent_ml: 2,
    storage: 'Refrigerate 2–8°C; protect from light once mixed.',
    typical_protocols: ['Daily'],
    notes: ['Demo data: common research ranges 250–500 mcg per administration.'],
    benefits: ['Tissue protection in preclinical models'],
    side_effects: ['Injection site irritation'],
    citations: {
      'Refrigerate 2–8°C; protect from light once mixed.': [
        {
          title: 'AAPPTEC: Handling and Storage of Peptides',
          url: 'https://www.peptide.com/faqs/handling-and-storage-of-peptides/',
        },
      ],
      Daily: [
        {
          title: 'PubMed search: BPC-157',
          url: 'https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157',
        },
      ],
      'Demo data: common research ranges 250–500 mcg per administration.': [
        {
          title: 'PubMed search: BPC-157',
          url: 'https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157',
        },
      ],
      'Tissue protection in preclinical models': [
        {
          title: 'PubMed search: BPC-157',
          url: 'https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157',
        },
      ],
      'Injection site irritation': [
        {
          title: 'GenScript: Peptide Storage and Handling Guidelines',
          url: 'https://www.genscript.com/peptide_storage_and_handling.html',
        },
      ],
    },
  },
  {
    id: 'demo-ipamorelin',
    name: 'Ipamorelin',
    aka: [],
    category: 'GHRP',
    vial_amount_mg: 2,
    typical_diluent_ml: 2,
    storage: 'Store lyophilized and reconstituted at 2–8°C.',
    typical_protocols: ['Daily'],
    notes: ['Demo data: often researched 100–300 mcg per administration.'],
    benefits: ['Selective GH pulse support'],
    side_effects: ['Hunger, flushing'],
    citations: {
      'Store lyophilized and reconstituted at 2–8°C.': [
        {
          title: 'Bachem: Reconstitution of Peptides',
          url: 'https://www.bachem.com/knowledge-center/technologies/reconstitution-of-peptides/',
        },
      ],
      Daily: [
        {
          title: 'PubMed search: Ipamorelin',
          url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Ipamorelin',
        },
      ],
      'Demo data: often researched 100–300 mcg per administration.': [
        {
          title: 'PubMed search: Ipamorelin',
          url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Ipamorelin',
        },
      ],
      'Selective GH pulse support': [
        {
          title: 'PubMed search: Ipamorelin',
          url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Ipamorelin',
        },
      ],
      'Hunger, flushing': [
        {
          title: 'PubMed search: Ipamorelin',
          url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Ipamorelin',
        },
      ],
    },
  },
  {
    id: 'demo-semaglutide',
    name: 'Semaglutide',
    aka: ['GLP-1 analog'],
    category: 'Metabolic peptide',
    vial_amount_mg: 5,
    typical_diluent_ml: 2,
    storage: 'Keep 2–8°C; avoid light after mixing.',
    typical_protocols: ['Once weekly'],
    notes: ['Demo data: long half-life; once-weekly research dosing paradigms.'],
    benefits: ['Appetite and glycemic modulation research'],
    side_effects: ['Nausea, GI upset'],
    citations: {
      'Keep 2–8°C; avoid light after mixing.': [
        {
          title: 'DailyMed: Ozempic (semaglutide) label',
          url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=adec4fd2-6858-4c99-91d4-531f5f2a2d79',
        },
      ],
      'Once weekly': [
        {
          title: 'DailyMed: Ozempic (semaglutide) label',
          url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=adec4fd2-6858-4c99-91d4-531f5f2a2d79',
        },
      ],
      'Demo data: long half-life; once-weekly research dosing paradigms.': [
        {
          title: 'DailyMed: Ozempic (semaglutide) label',
          url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=adec4fd2-6858-4c99-91d4-531f5f2a2d79',
        },
      ],
      'Appetite and glycemic modulation research': [
        {
          title: 'PubMed search: Semaglutide',
          url: 'https://pubmed.ncbi.nlm.nih.gov/?term=Semaglutide',
        },
      ],
      'Nausea, GI upset': [
        {
          title: 'DailyMed: Ozempic (semaglutide) label',
          url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=adec4fd2-6858-4c99-91d4-531f5f2a2d79',
        },
      ],
    },
  },
];

const OFFLINE_DISCLAIMER = {
  title: 'Offline demo mode',
  body:
    'Backend unreachable. Showing demo peptides and local-only calculations. Research use only; this is not medical advice.',
  legal_footer: DEFAULT_LEGAL_FOOTER,
};

function computeLocalCalculation(input) {
  const vialAmount = Number(input.vial_amount);
  const diluent = Number(input.diluent_ml);
  const desiredDose = Number(input.desired_dose);

  if ([vialAmount, diluent, desiredDose].some((v) => !isFinite(v) || v <= 0)) {
    throw new Error('Inputs must be positive numbers.');
  }

  const toMg = (val, unit) => (unit === 'mg' ? val : val / 1000);
  const vialMg = toMg(vialAmount, input.vial_unit);
  const desiredMg = toMg(desiredDose, input.desired_unit);
  const concentration = vialMg / diluent;
  const doseVol = desiredMg / concentration;

  return {
    concentration_mg_per_ml: Number(concentration.toFixed(4)),
    dose_volume_ml: Number(doseVol.toFixed(4)),
    note: 'Local estimate — verify when backend is available.',
  };
}

function toMg(value, unit) {
  if (unit === 'mg') return value;
  return value / 1000;
}

function formatNumber(value, decimals = 4) {
  if (!isFinite(value)) return '—';
  return Number(value.toFixed(decimals)).toString();
}

export default function App() {
  const [peptides, setPeptides] = useState([]);
  const [query, setQuery] = useState('');
  const [calcInput, setCalcInput] = useState({
    vial_amount: '5',
    vial_unit: 'mg',
    diluent_ml: '2',
    desired_dose: '0.25',
    desired_unit: 'mg',
  });
  const [calcResult, setCalcResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [disclaimer, setDisclaimer] = useState(null);
  const guideRef = useRef(null);
  const [showGuide, setShowGuide] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [citationsFor, setCitationsFor] = useState(null);
  const [syringeProfileId, setSyringeProfileId] = useState(SYRINGE_PROFILES[0].id);
  const [copyStatus, setCopyStatus] = useState('');
  const copyTimeoutRef = useRef(null);

  const selectedSyringeProfile = useMemo(
    () => SYRINGE_PROFILES.find((profile) => profile.id === syringeProfileId) || SYRINGE_PROFILES[0],
    [syringeProfileId],
  );

  const legalFooter = useMemo(() => {
    const items = disclaimer?.legal_footer;
    if (Array.isArray(items)) {
      const cleaned = items.filter((item) => typeof item === 'string' && item.trim());
      if (cleaned.length > 0) return cleaned;
    }
    return DEFAULT_LEGAL_FOOTER;
  }, [disclaimer]);

  useEffect(() => {
    const storedConsent = localStorage.getItem('consentGiven');
    if (storedConsent === 'true') setConsentGiven(true);
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [pRes, dRes] = await Promise.all([
          fetch(`${API_BASE}/peptides`),
          fetch(`${API_BASE}/disclaimer`),
        ]);
        if (!pRes.ok || !dRes.ok) throw new Error('API unavailable');
        setPeptides(await pRes.json());
        setDisclaimer(await dRes.json());
      } catch {
        setOfflineMode(true);
        setPeptides(OFFLINE_PEPTIDES);
        setDisclaimer(OFFLINE_DISCLAIMER);
        setError('Backend unreachable; using offline demo data.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = useMemo(() => {
    if (!query) return peptides;
    return peptides.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.aka || []).some((alias) => alias.toLowerCase().includes(query.toLowerCase()))
    );
  }, [peptides, query]);

  const orderedFactSections = useMemo(() => {
    if (!citationsFor) return [];

    const safeList = (v) => (Array.isArray(v) ? v.filter(Boolean) : []);
    return [
      { label: 'Storage', facts: citationsFor.storage ? [citationsFor.storage] : [] },
      { label: 'Typical protocol', facts: safeList(citationsFor.typical_protocols) },
      { label: 'Notes', facts: safeList(citationsFor.notes) },
      { label: 'Potential benefits', facts: safeList(citationsFor.benefits) },
      { label: 'Known/expected side effects', facts: safeList(citationsFor.side_effects) },
    ].filter((s) => s.facts.length > 0);
  }, [citationsFor]);

  const calcBreakdown = useMemo(() => {
    const vialAmount = Number(calcInput.vial_amount);
    const diluent = Number(calcInput.diluent_ml);
    const desiredDose = Number(calcInput.desired_dose);
    if ([vialAmount, diluent, desiredDose].some((value) => !isFinite(value) || value <= 0)) {
      return null;
    }

    const vialMg = toMg(vialAmount, calcInput.vial_unit);
    const desiredMg = toMg(desiredDose, calcInput.desired_unit);
    const concentration = vialMg / diluent;
    const doseVolumeMl = desiredMg / concentration;
    return { vialMg, desiredMg, concentration, doseVolumeMl };
  }, [calcInput]);

  const handleCalcChange = (field, value) => {
    setCalcInput((prev) => ({ ...prev, [field]: value }));
  };

  const runCalc = async () => {
    setError('');
    setCalcResult(null);
    setCopyStatus('');
    try {
      const res = await fetch(`${API_BASE}/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vial_amount: Number(calcInput.vial_amount),
          vial_unit: calcInput.vial_unit,
          diluent_ml: Number(calcInput.diluent_ml),
          desired_dose: Number(calcInput.desired_dose),
          desired_unit: calcInput.desired_unit,
        }),
      });
      if (!res.ok) throw new Error('Bad request');
      const data = await res.json();
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

  const syringeUnitsRaw = useMemo(() => {
    if (!calcResult) return null;
    return Math.max(calcResult.dose_volume_ml * 100, 0);
  }, [calcResult]);

  const syringeUnits = useMemo(() => {
    if (syringeUnitsRaw === null) return null;
    return Math.min(syringeUnitsRaw, selectedSyringeProfile.max_units);
  }, [selectedSyringeProfile.max_units, syringeUnitsRaw]);

  const doseWarnings = useMemo(() => {
    if (!calcResult || syringeUnitsRaw === null) return [];
    const warnings = [];

    if (calcResult.dose_volume_ml < 0.03) {
      warnings.push('Volume < 0.03 mL (3 units): high measurement uncertainty at this scale.');
    }
    if (calcResult.dose_volume_ml < 0.01) {
      warnings.push('Volume < 0.01 mL (1 unit): increase diluent volume to reduce per-unit concentration.');
    }
    if (calcResult.dose_volume_ml > selectedSyringeProfile.max_ml) {
      warnings.push(
        `Dose exceeds selected syringe capacity (${selectedSyringeProfile.max_ml} mL / ${selectedSyringeProfile.max_units} units). Split dose or select a larger syringe.`,
      );
    } else if (calcResult.dose_volume_ml >= selectedSyringeProfile.max_ml * 0.9) {
      warnings.push('Dose volume ≥ 90% of syringe capacity: reduced measurement accuracy at end-range.');
    }

    return warnings;
  }, [calcResult, selectedSyringeProfile.max_ml, selectedSyringeProfile.max_units, syringeUnitsRaw]);

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

    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => {
      setCopyStatus('');
    }, 2400);
  };

  const syringeSvg = useMemo(() => {
    if (syringeUnits === null || syringeUnitsRaw === null) return null;
    const width = 160;
    const height = 420;
    const barrelWidth = 36;
    const fillInset = 4;
    const barrelX = (width - barrelWidth) / 2;
    const barrelTop = 80;
    const barrelHeight = 220;
    const hubHeight = 18;
    const hubWidth = barrelWidth - 6;
    const fillRatio = Math.min(Math.max(syringeUnits / selectedSyringeProfile.max_units, 0), 1);
    const stopperHeight = 10;
    const stopperY = barrelTop + fillRatio * barrelHeight;
    const liquidHeight = stopperY - barrelTop;
    const thumbTop = height - 30;
    const rodTop = stopperY + stopperHeight;
    const rodHeight = Math.max(thumbTop - rodTop, 8);
    const barrelCenterX = barrelX + barrelWidth / 2;
    const ticks = Array.from({ length: Math.floor(selectedSyringeProfile.max_units / 5) + 1 }, (_, i) => i * 5);

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Pull to ${formatNumber(syringeUnitsRaw, 1)} insulin units on ${selectedSyringeProfile.label}`}
        className="syringe-svg"
      >
        <defs>
          <linearGradient id="syringe-fill-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
          <clipPath id="barrel-clip">
            <rect x={barrelX} y={barrelTop} width={barrelWidth} height={barrelHeight} rx="8" />
          </clipPath>
        </defs>
        <line x1={barrelCenterX} y1="6" x2={barrelCenterX} y2={barrelTop - hubHeight} className="syringe-needle" />
        <rect
          x={barrelCenterX - hubWidth / 2}
          y={barrelTop - hubHeight}
          width={hubWidth}
          height={hubHeight}
          rx="3"
          className="syringe-hub"
        />
        <rect
          x={barrelX}
          y={barrelTop}
          width={barrelWidth}
          height={barrelHeight}
          rx="8"
          className="syringe-barrel"
        />
        <rect
          x={barrelX + fillInset}
          y={barrelTop}
          width={barrelWidth - fillInset * 2}
          height={Math.max(liquidHeight, 0)}
          rx="8"
          className="syringe-fill-rect syringe-anim"
        />
        <rect
          x={barrelX + fillInset - 2}
          y={stopperY}
          width={barrelWidth - fillInset * 2 + 4}
          height={stopperHeight}
          rx="4"
          className="syringe-stopper syringe-anim"
        />
        {ticks.map((tick) => {
          const y = barrelTop + (tick / selectedSyringeProfile.max_units) * barrelHeight;
          const isMajor = tick % selectedSyringeProfile.major_tick_units === 0;
          return (
            <g key={tick}>
              <line
                x1={barrelX - 10}
                y1={y}
                x2={barrelX - 14 - (isMajor ? 6 : 0)}
                y2={y}
                className="syringe-tick"
              />
              {isMajor && (
                <text x={barrelX - 22} y={y + 4} textAnchor="end" className="syringe-tick-label">
                  {tick}
                </text>
              )}
            </g>
          );
        })}
        <g transform={`translate(${barrelX + barrelWidth + 16}, ${stopperY})`} className="syringe-anim">
          <circle cx="0" cy="0" r="8" className="syringe-marker-bubble" />
          <text x="12" y="4" textAnchor="start" className="syringe-marker-label">
            {formatNumber(syringeUnitsRaw, 1)} u
          </text>
        </g>
        <rect
          x={barrelCenterX - 6}
          y={rodTop}
          width="12"
          height={rodHeight}
          rx="4"
          className="syringe-rod syringe-anim"
        />
        <rect x={barrelCenterX - 18} y={thumbTop} width="36" height="22" rx="8" className="syringe-thumb" />
      </svg>
    );
  }, [selectedSyringeProfile, syringeUnits, syringeUnitsRaw]);

  return (
    <div className="page">
      <div className="orb" />
      <header className="hero">
        <div>
          <p className="eyebrow">Harm Reduction • Research Only</p>
          <h1>Peptide Reconstitution & Dosing Math</h1>
          <p className="lede">
            Practical calculations, storage reminders, and labeling prompts to reduce preventable mistakes.
            No medical advice. Always consult qualified professionals.
          </p>
          {disclaimer?.title && <div className="chip">{disclaimer.title}</div>}
          {offlineMode && (
            <div className="chip danger">Offline demo — calculations run locally.</div>
          )}
        </div>
        <div className="pill">
          <h3>Safety checklist</h3>
          <ul>
            <li>Label vials with peptide name and concentration.</li>
            <li>Use bacteriostatic/sterile water; never tap water.</li>
            <li>Wipe stoppers with alcohol; use new needles.</li>
            <li>Discard cloudy or particulate solutions.</li>
          </ul>
        </div>
	      </header>

	      <main className="grid">
	        <section className="panel directory">
	          <div className="panel-head">
	            <div>
	              <p className="eyebrow">Peptide directory</p>
	              <h2>Profiles & storage</h2>
	            </div>
	            <input
	              type="search"
	              placeholder="Search by name or alias"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
	          {loading && <p className="muted">Loading peptide list…</p>}
	          {error && <p className="error">{error}</p>}
	          <div className="cards">
	            {filtered.map((p) => {
	              return (
	                <article key={p.id} className="card">
	                  <div className="card-top">
	                    <div>
	                      <p className="eyebrow">{p.category}</p>
	                      <h3>{p.name}</h3>
	                      {p.aka?.length > 0 && <p className="muted">aka {p.aka.join(', ')}</p>}
	                    </div>
	                    <div className="card-top-right">
	                      <div className="badge">{p.vial_amount_mg} mg vial</div>
	                      <button className="cite-btn" onClick={() => setCitationsFor(p)}>
	                        View citations
	                      </button>
	                    </div>
	                  </div>
	                  <dl>
	                    <div>
	                      <dt>Diluent</dt>
	                      <dd>{p.typical_diluent_ml} mL suggested</dd>
	                    </div>
	                    <div>
	                      <dt>Storage</dt>
	                      <dd>{p.storage}</dd>
	                    </div>
	                    {p.typical_protocols?.length > 0 && (
	                      <div>
	                        <dt>Typical protocol</dt>
	                        <dd>{p.typical_protocols.join(', ')}</dd>
	                      </div>
	                    )}
	                  </dl>
                  <div className="tag-block">
                    <p className="eyebrow">Potential benefits</p>
                    <ul className="tag-list">
                      {p.benefits?.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="tag-block caution">
                    <p className="eyebrow">Known/expected side effects</p>
                    <ul className="tag-list">
                      {p.side_effects?.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
	                  <ul className="notes">
	                    {p.notes.map((n, idx) => (
	                      <li key={idx}>{n}</li>
	                    ))}
	                  </ul>
	                </article>
              );
            })}
            {!loading && filtered.length === 0 && <p className="muted">No matches.</p>}
          </div>
	        </section>

	        <div className="right-stack">
	          <section className="panel calculator">
	            <div className="panel-head">
	              <div>
	                <p className="eyebrow">Dose math</p>
	                <h2>Reconstitution Calculator</h2>
	              </div>
              <div className="head-actions">
                <button className="ghost-btn" onClick={() => window.print()}>Print</button>
                <button className="guide-btn" onClick={() => setShowGuide((s) => !s)}>
                  {showGuide ? 'Hide guide' : 'Show guide'}
                </button>
              </div>
            </div>
            <p className="muted">Supports mg and mcg/µg inputs. Outputs are volumetric for insulin syringes.</p>
            {showGuide && (
              <div className="guide-flyout" ref={guideRef}>
                <div className="guide-card">
                  <p className="eyebrow">Reconstitution guide</p>
                  <h3>Step-by-step</h3>
                  <div className="recon-grid">
                    <div>
                      <p className="eyebrow">Supplies</p>
                      <ul className="tight">
                        <li>Lyophilized peptide vial</li>
                        <li>Bacteriostatic water (BAC) or supplier-recommended diluent</li>
                        <li>Alcohol pads (70% IPA)</li>
                        <li>Insulin syringes (1 mL / 100 u) + 18–23G draw needle</li>
                        <li>Sterile mixing syringe (3–5 mL) optional</li>
                        <li>Labels + fine marker; sharps container</li>
                      </ul>
                    </div>
                    <div>
                      <p className="eyebrow">Steps</p>
                      <ol className="tight">
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
                      <p className="eyebrow">Red flags</p>
                      <ul className="tight red">
                        <li>Cloudiness, particles, color change → discard.</li>
                        <li>Cracked stopper, leaking vial → discard.</li>
                        <li>Unusual odor or precipitate after mixing → discard.</li>
                        <li>Break sterility (touched needle, non-sterile water) → discard and restart.</li>
                        <li>Adverse reactions (heat, redness, systemic symptoms) → stop and seek medical care.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="form">
              <label>
                Vial powder
                <div className="inline">
                  <input
                    type="number"
                    step="0.01"
                    value={calcInput.vial_amount}
                    onChange={(e) => handleCalcChange('vial_amount', e.target.value)}
                  />
                  <select value={calcInput.vial_unit} onChange={(e) => handleCalcChange('vial_unit', e.target.value)}>
                    <option value="mg">mg</option>
                    <option value="mcg">mcg / µg</option>
                  </select>
                </div>
              </label>
              <label>
                Diluent volume (mL)
                <input
                  type="number"
                  step="0.01"
                  value={calcInput.diluent_ml}
                  onChange={(e) => handleCalcChange('diluent_ml', e.target.value)}
                />
              </label>
              <label>
                Desired dose
                <div className="inline">
                  <input
                    type="number"
                    step="0.01"
                    value={calcInput.desired_dose}
                    onChange={(e) => handleCalcChange('desired_dose', e.target.value)}
                  />
                  <select value={calcInput.desired_unit} onChange={(e) => handleCalcChange('desired_unit', e.target.value)}>
                    <option value="mg">mg</option>
                    <option value="mcg">mcg / µg</option>
                  </select>
                </div>
              </label>
              <label>
                Syringe type
                <select value={syringeProfileId} onChange={(e) => setSyringeProfileId(e.target.value)}>
                  {SYRINGE_PROFILES.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="consent">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => {
                    setConsentGiven(e.target.checked);
                    localStorage.setItem('consentGiven', e.target.checked ? 'true' : 'false');
                  }}
                />
                <span>I understand this is not medical advice.</span>
              </label>
              <button onClick={runCalc} disabled={!consentGiven}>Calculate</button>
            </div>
            {calcResult && (
              <div className="result">
                <div>
                  <p className="eyebrow">Concentration</p>
                  <strong>{formatNumber(calcResult.concentration_mg_per_ml, 4)} mg/mL</strong>
                </div>
                <div>
                  <p className="eyebrow">Dose volume</p>
                  <strong>{formatNumber(calcResult.dose_volume_ml, 4)} mL</strong>
                </div>
                <div>
                  <p className="eyebrow">Syringe units (U-100)</p>
                  <strong>{syringeUnitsRaw === null ? '—' : `${formatNumber(syringeUnitsRaw, 1)} u`}</strong>
                  <p className="muted calc-meta">{selectedSyringeProfile.label}</p>
                </div>
                {syringeSvg && <div className="syringe-visual">{syringeSvg}</div>}
                {doseWarnings.length > 0 && (
                  <div className="calc-warnings" role="alert">
                    <p className="eyebrow">Dose guardrails</p>
                    <ul>
                      {doseWarnings.map((warning) => (
                        <li key={warning}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {calcBreakdown && (
                  <div className="calc-steps">
                    <p className="eyebrow">Calculation steps</p>
                    <ol>
                      <li>
                        Convert units: vial = {formatNumber(calcBreakdown.vialMg, 4)} mg, dose ={' '}
                        {formatNumber(calcBreakdown.desiredMg, 4)} mg.
                      </li>
                      <li>
                        Concentration = {formatNumber(calcBreakdown.vialMg, 4)} mg /{' '}
                        {formatNumber(Number(calcInput.diluent_ml), 4)} mL ={' '}
                        {formatNumber(calcBreakdown.concentration, 4)} mg/mL.
                      </li>
                      <li>
                        Volume = {formatNumber(calcBreakdown.desiredMg, 4)} mg /{' '}
                        {formatNumber(calcBreakdown.concentration, 4)} mg/mL ={' '}
                        {formatNumber(calcBreakdown.doseVolumeMl, 4)} mL ({formatNumber(calcBreakdown.doseVolumeMl * 100, 1)} units).
                      </li>
                    </ol>
                  </div>
                )}
                <div className="result-actions">
                  <button className="ghost-btn" onClick={copyCalculation}>
                    Copy result
                  </button>
                  {copyStatus && <span className="muted copy-status">{copyStatus}</span>}
                </div>
                <p className="muted note">{calcResult.note}</p>
              </div>
	            )}
	            {error && !loading && <p className="error">{error}</p>}
	          </section>

	          <section className="panel callouts">
	            <p className="eyebrow">Harm reduction prompts</p>
	            <ul>
              <li>
                <strong>Labeling:</strong> include peptide name and concentration (mg/mL).
              </li>
              <li>
                <strong>Storage:</strong> keep reconstituted vials 2–8°C, protect from light, avoid repeated freeze/thaw.
              </li>
              <li>
                <strong>Injection hygiene:</strong> alcohol swab vial stopper and skin; new needle each entry; avoid sharing.
              </li>
              <li>
                <strong>Observation:</strong> monitor for redness, heat, or unexpected reactions; seek emergency care for adverse events.
              </li>
              <li>
                <strong>Disposal:</strong> use a sharps container; do not recap used needles if avoidable.
              </li>
            </ul>
          </section>
	        </div>
	      </main>

        <footer className="footer">
          <p className="eyebrow">Legal</p>
          <h3>Disclaimer</h3>
          {disclaimer?.body && <p className="muted footer-body">{disclaimer.body}</p>}
          <ul className="footer-list">
            {legalFooter.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </footer>

        {citationsFor && (
          <div className="modal-backdrop" role="presentation" onClick={() => setCitationsFor(null)}>
            <div
              className="modal"
              role="dialog"
              aria-modal="true"
              aria-label={`Citations for ${citationsFor.name}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-head">
                <div>
                  <p className="eyebrow">Citations</p>
                  <h2>{citationsFor.name}</h2>
                </div>
                <button className="icon-btn" onClick={() => setCitationsFor(null)} aria-label="Close citations">
                  ×
                </button>
              </div>
              <div className="cite-body">
                {orderedFactSections.map((section) => (
                  <div key={section.label} className="cite-section">
                    <p className="eyebrow">{section.label}</p>
                    {section.facts.map((fact) => {
                      const sources = citationsFor.citations?.[fact] || [];
                      return (
                        <div key={fact} className="cite-item">
                          <p className="cite-fact">{fact}</p>
                          {sources.length === 0 ? (
                            <p className="muted">No citations provided.</p>
                          ) : (
                            <ul className="cite-sources">
                              {sources.map((c, idx) => (
                                <li key={`${c.url}-${idx}`}>
                                  <a href={c.url} target="_blank" rel="noreferrer">
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
        )}
      </div>
    );
  }
