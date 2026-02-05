import { useEffect, useMemo, useState } from 'react';
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
      setCalcResult(await res.json());
    } catch (err) {
      setError('Calculation failed. Ensure numbers are positive and backend is running.');
    }
  };

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
        <section className="panel">
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
          <p className="eyebrow">Dose math</p>
          <h2>Reconstitution Calculator</h2>
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
              <p className="muted note">{calcResult.note}</p>
            </div>
          )}
          {error && !loading && <p className="error">{error}</p>}
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
