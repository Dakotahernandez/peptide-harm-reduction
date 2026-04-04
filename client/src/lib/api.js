import { API_BASE, OFFLINE_PEPTIDES, OFFLINE_DISCLAIMER } from './constants';

export async function fetchPeptidesAndDisclaimer() {
  const [pRes, dRes] = await Promise.all([
    fetch(`${API_BASE}/peptides`),
    fetch(`${API_BASE}/disclaimer`),
  ]);
  if (!pRes.ok || !dRes.ok) throw new Error('API unavailable');
  return {
    peptides: await pRes.json(),
    disclaimer: await dRes.json(),
  };
}

export async function fetchCalculation(calcInput) {
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
  return res.json();
}

export function getOfflineData() {
  return {
    peptides: OFFLINE_PEPTIDES,
    disclaimer: OFFLINE_DISCLAIMER,
  };
}
