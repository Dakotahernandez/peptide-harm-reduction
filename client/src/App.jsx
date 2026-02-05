import { useEffect, useMemo, useState, useRef } from 'react';
import './App.css';

const API_BASE = 'http://localhost:8000';

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
  const [showGuide, setShowGuide] = useState(false);

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
      } catch (err) {
        setError('Could not reach backend. Confirm `uvicorn main:app --reload` is running on port 8000.');
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

  const handleCalcChange = (field, value) => {
    setCalcInput((prev) => ({ ...prev, [field]: value }));
  };

  const runCalc = async () => {
    setError('');
    setCalcResult(null);
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
    } catch (err) {
      setError('Calculation failed. Ensure numbers are positive and backend is running.');
    }
  };

  const syringeUnits = useMemo(() => {
    if (!calcResult) return null;
    // Standard 1 mL / 100-unit insulin syringe mapping
    return Math.min(Math.max(calcResult.dose_volume_ml * 100, 0), 100);
  }, [calcResult]);

  const syringeSvg = useMemo(() => {
    if (syringeUnits === null) return null;
    const width = 160;
    const height = 420;
    const barrelWidth = 36;
    const fillInset = 4;
    const barrelX = (width - barrelWidth) / 2;
    const barrelTop = 80;
    const barrelHeight = 220;
    const hubHeight = 18;
    const hubWidth = barrelWidth - 6;
    const fillRatio = Math.min(Math.max(syringeUnits / 100, 0), 1);
    const stopperHeight = 10;
    // TOP of stopper aligns with ticks (0 at needle tip)
    const stopperY = barrelTop + fillRatio * barrelHeight;
    const liquidHeight = stopperY - barrelTop;
    const thumbTop = height - 30;
    const rodTop = stopperY + stopperHeight;
    const rodHeight = Math.max(thumbTop - rodTop, 8);
    const barrelCenterX = barrelX + barrelWidth / 2;
    const ticks = Array.from({ length: 21 }, (_, i) => i * 5); // 0..100 by 5s
    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Pull to ${syringeUnits.toFixed(1)} insulin units`}
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
        {/* Needle on top (center) */}
        <line x1={barrelCenterX} y1="6" x2={barrelCenterX} y2={barrelTop - hubHeight} className="syringe-needle" />
        <rect
          x={barrelCenterX - hubWidth / 2}
          y={barrelTop - hubHeight}
          width={hubWidth}
          height={hubHeight}
          rx="3"
          className="syringe-hub"
        />
        {/* Barrel outline */}
        <rect
          x={barrelX}
          y={barrelTop}
          width={barrelWidth}
          height={barrelHeight}
          rx="8"
          className="syringe-barrel"
        />
        {/* Fill inside barrel (from needle downward) */}
        <rect
          x={barrelX + fillInset}
          y={barrelTop}
          width={barrelWidth - fillInset * 2}
          height={Math.max(liquidHeight, 0)}
          rx="8"
          className="syringe-fill-rect syringe-anim"
        />
        {/* Stopper following fill */}
        <rect
          x={barrelX + fillInset - 2}
          y={stopperY}
          width={barrelWidth - fillInset * 2 + 4}
          height={stopperHeight}
          rx="4"
          className="syringe-stopper syringe-anim"
        />
        {/* Ticks along left side (needle origin) */}
        {ticks.map((t) => {
          const y = barrelTop + (t / 100) * barrelHeight;
          const isMajor = t % 10 === 0;
          return (
            <g key={t}>
              <line
                x1={barrelX - 10}
                y1={y}
                x2={barrelX - 14 - (isMajor ? 6 : 0)}
                y2={y}
                className="syringe-tick"
              />
              {isMajor && (
                <text x={barrelX - 22} y={y + 4} textAnchor="end" className="syringe-tick-label">
                  {t}
                </text>
              )}
            </g>
          );
        })}
        {/* Marker bubble aligned to stopper */}
        <g transform={`translate(${barrelX + barrelWidth + 16}, ${stopperY})`} className="syringe-anim">
          <circle cx="0" cy="0" r="8" className="syringe-marker-bubble" />
          <text x="12" y="4" textAnchor="start" className="syringe-marker-label">
            {syringeUnits.toFixed(1)} u
          </text>
        </g>
        {/* Plunger rod & thumb pad at bottom */}
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
  }, [syringeUnits]);

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
          {disclaimer && (
            <div className="chip">Updated {disclaimer.updated}</div>
          )}
        </div>
        <div className="pill">
          <h3>Safety checklist</h3>
          <ul>
            <li>Label vials with concentration and prep date.</li>
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
            {filtered.map((p) => (
              <article key={p.id} className="card">
                <div className="card-top">
                  <div>
                    <p className="eyebrow">{p.category}</p>
                    <h3>{p.name}</h3>
                    {p.aka?.length > 0 && <p className="muted">aka {p.aka.join(', ')}</p>}
                  </div>
                  <div className="badge">{p.vial_amount_mg} mg vial</div>
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
                  {p.stability_refrigerated_days && (
                    <div>
                      <dt>Stability (2–8°C)</dt>
                      <dd>{p.stability_refrigerated_days} days</dd>
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
            ))}
            {!loading && filtered.length === 0 && <p className="muted">No matches.</p>}
          </div>
        </section>

        <section className="panel calculator">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Dose math</p>
              <h2>Reconstitution Calculator</h2>
            </div>
            <button className="guide-btn" onClick={() => setShowGuide((s) => !s)}>
              {showGuide ? 'Hide guide' : 'Show guide'}
            </button>
          </div>
          <p className="muted">Supports mg and mcg/µg inputs. Outputs are volumetric for insulin syringes.</p>
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
            <button onClick={runCalc}>Calculate</button>
          </div>
          {calcResult && (
            <div className="result">
              <div>
                <p className="eyebrow">Concentration</p>
                <strong>{calcResult.concentration_mg_per_ml} mg/mL</strong>
              </div>
              <div>
                <p className="eyebrow">Pull this volume</p>
                <strong>{calcResult.dose_volume_ml} mL</strong>
              </div>
              {syringeSvg && <div className="syringe-visual">{syringeSvg}</div>}
              <p className="muted note">{calcResult.note}</p>
            </div>
          )}
          {error && !loading && <p className="error">{error}</p>}
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
                      <li>Label vial with peptide, concentration (mg/mL), prep date, discard date.</li>
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
        </section>

        <section className="panel callouts">
          <p className="eyebrow">Harm reduction prompts</p>
          <ul>
            <li>
              <strong>Labeling:</strong> include peptide name, concentration (mg/mL), prep date, and discard date.
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
      </main>

    </div>
  );
}
