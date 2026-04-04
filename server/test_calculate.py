from main import CalculationRequest, calculate_dose


def test_calculation_rounding():
    payload = CalculationRequest(vial_amount=5, vial_unit="mg", diluent_ml=2, desired_dose=0.25, desired_unit="mg")
    result = calculate_dose(payload)
    assert result.concentration_mg_per_ml == 2.5
    assert result.dose_volume_ml == 0.1


def test_calculation_scale():
    payload = CalculationRequest(vial_amount=10, vial_unit="mg", diluent_ml=1, desired_dose=1, desired_unit="mg")
    result = calculate_dose(payload)
    assert result.concentration_mg_per_ml == 10
    assert result.dose_volume_ml == 0.1


def test_microgram_to_mg_conversion():
    payload = CalculationRequest(vial_amount=2000, vial_unit="mcg", diluent_ml=2, desired_dose=250, desired_unit="mcg")
    result = calculate_dose(payload)
    assert result.concentration_mg_per_ml == 1.0
    assert result.dose_volume_ml == 0.25


def test_ug_alias():
    payload = CalculationRequest(vial_amount=2000, vial_unit="ug", diluent_ml=2, desired_dose=250, desired_unit="ug")
    result = calculate_dose(payload)
    assert result.concentration_mg_per_ml == 1.0
    assert result.dose_volume_ml == 0.25


def test_mu_g_symbol_alias():
    payload = CalculationRequest(vial_amount=2000, vial_unit="µg", diluent_ml=2, desired_dose=250, desired_unit="µg")
    result = calculate_dose(payload)
    assert result.concentration_mg_per_ml == 1.0
    assert result.dose_volume_ml == 0.25
