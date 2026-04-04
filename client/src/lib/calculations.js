export function toMg(value, unit) {
  if (unit === 'mg') return value;
  return value / 1000;
}

export function formatNumber(value, decimals = 4) {
  if (!isFinite(value)) return '—';
  return Number(value.toFixed(decimals)).toString();
}

export function computeLocalCalculation(input) {
  const vialAmount = Number(input.vial_amount);
  const diluent = Number(input.diluent_ml);
  const desiredDose = Number(input.desired_dose);

  if ([vialAmount, diluent, desiredDose].some((v) => !isFinite(v) || v <= 0)) {
    throw new Error('Inputs must be positive numbers.');
  }

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
