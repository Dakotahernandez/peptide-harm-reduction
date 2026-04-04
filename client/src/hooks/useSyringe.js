import { useMemo, useState } from 'react';
import { SYRINGE_PROFILES } from '@/lib/constants';
import { toMg } from '@/lib/calculations';

export function useSyringe(calcResult) {
  const [syringeProfileId, setSyringeProfileId] = useState(SYRINGE_PROFILES[0].id);

  const selectedSyringeProfile = useMemo(
    () => SYRINGE_PROFILES.find((p) => p.id === syringeProfileId) || SYRINGE_PROFILES[0],
    [syringeProfileId],
  );

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

  return {
    syringeProfileId,
    setSyringeProfileId,
    selectedSyringeProfile,
    syringeUnits,
    syringeUnitsRaw,
    doseWarnings,
  };
}

export function useCalcBreakdown(calcInput) {
  return useMemo(() => {
    const vialAmount = Number(calcInput.vial_amount);
    const diluent = Number(calcInput.diluent_ml);
    const desiredDose = Number(calcInput.desired_dose);
    if ([vialAmount, diluent, desiredDose].some((v) => !isFinite(v) || v <= 0)) return null;
    const vialMg = toMg(vialAmount, calcInput.vial_unit);
    const desiredMg = toMg(desiredDose, calcInput.desired_unit);
    const concentration = vialMg / diluent;
    const doseVolumeMl = desiredMg / concentration;
    return { vialMg, desiredMg, concentration, doseVolumeMl };
  }, [calcInput]);
}
