from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, PositiveFloat
from typing import List, Optional, Literal

from models import Peptide

app = FastAPI(
    title="Peptide Harm Reduction API",
    description=(
        "Educational endpoints providing non-medical information on peptide reconstitution "
        "and dosing math. For research and harm reduction; not medical advice."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Unit = Literal["mg", "mcg", "ug", "µg"]


class CalculationRequest(BaseModel):
    vial_amount: PositiveFloat = Field(..., description="Total powder in the vial")
    vial_unit: Unit = Field("mg", description="Unit for vial_amount")
    diluent_ml: PositiveFloat = Field(..., description="Total bacteriostatic/sterile water to add in mL")
    desired_dose: PositiveFloat = Field(..., description="Dose you want to withdraw")
    desired_unit: Unit = Field("mg", description="Unit for desired_dose")


class CalculationResponse(BaseModel):
    concentration_mg_per_ml: float
    dose_volume_ml: float
    note: str


from peptides_data import load_peptides

peptides: List[Peptide] = load_peptides()


@app.get("/peptides", response_model=List[Peptide])
def list_peptides(q: Optional[str] = Query(None, description="Filter by name or alias")):
    if not q:
        return peptides
    q_lower = q.lower()
    return [p for p in peptides if q_lower in p.name.lower() or any(q_lower in a.lower() for a in p.aka)]


@app.get("/peptides/{peptide_id}", response_model=Peptide)
def get_peptide(peptide_id: str):
    for peptide in peptides:
        if peptide.id == peptide_id:
            return peptide
    raise HTTPException(status_code=404, detail="Peptide not found")


@app.post("/calculate", response_model=CalculationResponse)
def calculate_dose(payload: CalculationRequest):
    def to_mg(amount: float, unit: Unit) -> float:
        if unit == "mg":
            return amount
        # treat mcg, ug, and µg as identical microgram inputs
        return amount / 1000

    vial_mg = to_mg(payload.vial_amount, payload.vial_unit)
    desired_mg = to_mg(payload.desired_dose, payload.desired_unit)

    concentration = vial_mg / payload.diluent_ml  # mg per mL
    dose_volume = desired_mg / concentration
    note = (
        "Always label vials with concentration and preparation date. Use sterile technique and discard "
        "solutions that appear cloudy or have particles."
    )
    return CalculationResponse(
        concentration_mg_per_ml=round(concentration, 4),
        dose_volume_ml=round(dose_volume, 4),
        note=note,
    )


@app.get("/disclaimer")
def disclaimer():
    return {
        "title": "Educational Use Only",
        "body": (
            "This site shares research-oriented information on peptide reconstitution and dosing math. "
            "It is not medical advice, does not endorse use, and is intended for harm reduction. "
            "Consult a qualified professional for any medical questions."
        ),
        "updated": "2026-02-05",
    }


@app.get("/health")
def healthcheck():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
