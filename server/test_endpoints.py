from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_disclaimer():
    res = client.get("/disclaimer")
    assert res.status_code == 200
    data = res.json()
    assert "title" in data
    assert "body" in data
    assert isinstance(data["legal_footer"], list)
    assert len(data["legal_footer"]) > 0


def test_list_peptides():
    res = client.get("/peptides")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "id" in data[0]
    assert "name" in data[0]


def test_list_peptides_filter():
    res = client.get("/peptides", params={"q": "BPC"})
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 1
    assert any("BPC" in p["name"] for p in data)


def test_list_peptides_filter_no_match():
    res = client.get("/peptides", params={"q": "zzz_nonexistent_zzz"})
    assert res.status_code == 200
    assert res.json() == []


def test_get_peptide_by_id():
    all_peptides = client.get("/peptides").json()
    first_id = all_peptides[0]["id"]
    res = client.get(f"/peptides/{first_id}")
    assert res.status_code == 200
    assert res.json()["id"] == first_id


def test_get_peptide_not_found():
    res = client.get("/peptides/nonexistent-id-999")
    assert res.status_code == 404
    assert res.json()["detail"] == "Peptide not found"


def test_calculate_valid():
    res = client.post(
        "/calculate",
        json={
            "vial_amount": 5,
            "vial_unit": "mg",
            "diluent_ml": 2,
            "desired_dose": 0.25,
            "desired_unit": "mg",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["concentration_mg_per_ml"] == 2.5
    assert data["dose_volume_ml"] == 0.1
    assert "note" in data


def test_calculate_mcg():
    res = client.post(
        "/calculate",
        json={
            "vial_amount": 2000,
            "vial_unit": "mcg",
            "diluent_ml": 2,
            "desired_dose": 250,
            "desired_unit": "mcg",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["concentration_mg_per_ml"] == 1.0
    assert data["dose_volume_ml"] == 0.25


def test_calculate_invalid_zero():
    res = client.post(
        "/calculate",
        json={
            "vial_amount": 0,
            "vial_unit": "mg",
            "diluent_ml": 2,
            "desired_dose": 0.25,
            "desired_unit": "mg",
        },
    )
    assert res.status_code == 422


def test_calculate_invalid_negative():
    res = client.post(
        "/calculate",
        json={
            "vial_amount": -5,
            "vial_unit": "mg",
            "diluent_ml": 2,
            "desired_dose": 0.25,
            "desired_unit": "mg",
        },
    )
    assert res.status_code == 422


def test_calculate_exceeds_bounds():
    res = client.post(
        "/calculate",
        json={
            "vial_amount": 999999,
            "vial_unit": "mg",
            "diluent_ml": 2,
            "desired_dose": 0.25,
            "desired_unit": "mg",
        },
    )
    assert res.status_code == 422


def test_calculate_invalid_unit():
    res = client.post(
        "/calculate",
        json={
            "vial_amount": 5,
            "vial_unit": "grams",
            "diluent_ml": 2,
            "desired_dose": 0.25,
            "desired_unit": "mg",
        },
    )
    assert res.status_code == 422
