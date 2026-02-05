from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, PositiveFloat
from typing import List, Optional, Literal

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


class Peptide(BaseModel):
    id: str
    name: str
    aka: List[str] = []
    category: str
    vial_amount_mg: PositiveFloat = Field(..., description="Amount of lyophilized powder per vial in mg")
    typical_diluent_ml: PositiveFloat
    storage: str
    stability_refrigerated_days: Optional[int] = None
    notes: List[str]


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


peptides: List[Peptide] = [
    Peptide(
        id="bpc-157",
        name="BPC-157",
        aka=["Body Protection Compound"],
        category="Protective peptide",
        vial_amount_mg=5.0,
        typical_diluent_ml=2.0,
        storage="Store lyophilized at 2-8°C; reconstituted solution 2-8°C and protect from light.",
        stability_refrigerated_days=20,
        notes=[
            "Common research dose ranges 250-500 mcg per administration.",
            "Use insulin syringes for subcutaneous research to improve volume accuracy.",
        ],
    ),
    Peptide(
        id="tb-500",
        name="TB-500",
        aka=["Thymosin Beta-4"],
        category="Regenerative peptide",
        vial_amount_mg=5.0,
        typical_diluent_ml=2.0,
        storage="Store lyophilized at 2-8°C; reconstituted solution 2-8°C; avoid repeated freeze-thaw.",
        stability_refrigerated_days=14,
        notes=[
            "Research ranges often 2-5 mg per week split into multiple administrations.",
            "Some researchers rotate injection sites to reduce irritation.",
        ],
    ),
    Peptide(
        id="ipamorelin",
        name="Ipamorelin",
        aka=[],
        category="GHRP",
        vial_amount_mg=2.0,
        typical_diluent_ml=2.0,
        storage="Store lyophilized at 2-8°C; reconstituted solution 2-8°C.",
        stability_refrigerated_days=10,
        notes=[
            "Often researched in the 100-300 mcg range per administration.",
            "Researchers avoid mixing with alcohol-based diluents to protect peptide integrity.",
        ],
    ),
    Peptide(
        id="cjc-1295-no-dac",
        name="CJC-1295 (no DAC)",
        aka=["MOD-GRF 1-29"],
        category="GHRH analog",
        vial_amount_mg=2.0,
        typical_diluent_ml=2.0,
        storage="Store lyophilized at 2-8°C; reconstituted solution 2-8°C.",
        stability_refrigerated_days=10,
        notes=[
            "Often paired with a GHRP like Ipamorelin in research protocols.",
            "Shorter half-life compared to DAC version; some divide daily administrations.",
        ],
    ),
    Peptide(
        id="cjc-1295-dac",
        name="CJC-1295 (with DAC)",
        aka=["CJC-1295 DAC"],
        category="GHRH analog",
        vial_amount_mg=2.0,
        typical_diluent_ml=2.0,
        storage="Store lyophilized at 2-8°C; reconstituted solution 2-8°C.",
        stability_refrigerated_days=14,
        notes=[
            "Longer half-life due to DAC; research dosing commonly 1-2 mg weekly.",
            "Roll vial gently after adding diluent to reduce foaming.",
        ],
    ),
    Peptide(
        id="sermorelin",
        name="Sermorelin",
        aka=[],
        category="GHRH analog",
        vial_amount_mg=2.0,
        typical_diluent_ml=2.0,
        storage="Store lyophilized at 2-8°C; reconstituted solution 2-8°C.",
        stability_refrigerated_days=10,
        notes=[
            "Research ranges often 200-500 mcg per administration.",
            "Some researchers administer pre-bed to align with natural GH pulses.",
        ],
    ),
    Peptide(
        id="ghrp-2",
        name="GHRP-2",
        aka=[],
        category="GHRP",
        vial_amount_mg=5.0,
        typical_diluent_ml=2.0,
        storage="Store lyophilized at 2-8°C; reconstituted solution 2-8°C.",
        stability_refrigerated_days=10,
        notes=[
            "Research doses often 100-300 mcg per administration.",
            "May cause transient hunger; plan timing accordingly in research settings.",
        ],
    ),
    Peptide(
        id="ghrp-6",
        name="GHRP-6",
        aka=[],
        category="GHRP",
        vial_amount_mg=5.0,
        typical_diluent_ml=2.0,
        storage="Store lyophilized at 2-8°C; reconstituted solution 2-8°C.",
        stability_refrigerated_days=10,
        notes=[
            "Research doses often 100-300 mcg per administration.",
            "Known to increase appetite; researchers monitor caloric intake effects.",
        ],
    ),
    Peptide(
        id="hexarelin",
        name="Hexarelin",
        aka=[],
        category="GHRP",
        vial_amount_mg=2.0,
        typical_diluent_ml=2.0,
        storage="Store lyophilized at 2-8°C; reconstituted solution 2-8°C.",
        stability_refrigerated_days=10,
        notes=[
            "Researchers often limit cycle length to reduce tachyphylaxis.",
            "Use gentle swirling to mix; avoid vigorous shaking.",
        ],
    ),
    Peptide(
        id="aod-9604",
        name="AOD-9604",
        aka=["Advanced Obesity Drug fragment"],
        category="Fragment peptide",
        vial_amount_mg=5.0,
        typical_diluent_ml=2.0,
        storage="Store lyophilized at 2-8°C; reconstituted solution 2-8°C.",
        stability_refrigerated_days=14,
        notes=[
            "Often researched at 250-500 mcg per administration.",
            "Researchers avoid freezing reconstituted solutions to maintain integrity.",
        ],
    ),
    Peptide(
        id="melanotan-2",
        name="Melanotan II",
        aka=["MT-2"],
        category="Melanocortin analog",
        vial_amount_mg=10.0,
        typical_diluent_ml=2.0,
        storage="Store lyophilized at 2-8°C; reconstituted solution 2-8°C and protect from light.",
        stability_refrigerated_days=30,
        notes=[
            "Test spots for skin reaction before broader application.",
            "Researchers minimize light exposure post-reconstitution to reduce degradation.",
        ],
    ),
    Peptide(
        id="pt-141",
        name="PT-141",
        aka=["Bremelanotide"],
        category="Melanocortin analog",
        vial_amount_mg=10.0,
        typical_diluent_ml=2.0,
        storage="Store lyophilized at 2-8°C; reconstituted solution 2-8°C.",
        stability_refrigerated_days=30,
        notes=[
            "Research doses often 1-2 mg per administration.",
            "Some researchers report flushing; observe and document responses.",
        ],
    ),
    Peptide(
        id="kpv",
        name="KPV",
        aka=["Lys-Pro-Val"],
        category="Anti-inflammatory peptide",
        vial_amount_mg=5.0,
        typical_diluent_ml=2.0,
        storage="Store lyophilized at 2-8°C; reconstituted solution 2-8°C.",
        stability_refrigerated_days=14,
        notes=[
            "Small tri-peptide; handle gently to avoid adsorption losses.",
            "Often researched for topical or systemic anti-inflammatory properties.",
        ],
    ),
    Peptide(
        id="selank",
        name="Selank",
        aka=[],
        category="Peptide analog",
        vial_amount_mg=10.0,
        typical_diluent_ml=2.0,
        storage="Store lyophilized at 2-8°C; reconstituted solution 2-8°C.",
        stability_refrigerated_days=14,
        notes=[
            "Some researchers use intranasal routes; sterile technique still applies.",
            "Avoid repeated freeze-thaw of reconstituted solution.",
        ],
    ),
    Peptide(
        id="semax",
        name="Semax",
        aka=[],
        category="Peptide analog",
        vial_amount_mg=10.0,
        typical_diluent_ml=2.0,
        storage="Store lyophilized at 2-8°C; reconstituted solution 2-8°C.",
        stability_refrigerated_days=14,
        notes=[
            "Intranasal research is common; use sterile atomizers if applicable.",
            "Protect from light after mixing to reduce oxidation.",
        ],
    ),
    Peptide(
        id="dsip",
        name="DSIP",
        aka=["Delta Sleep-Inducing Peptide"],
        category="Neuropeptide",
        vial_amount_mg=5.0,
        typical_diluent_ml=2.0,
        storage="Store lyophilized at 2-8°C; reconstituted solution 2-8°C.",
        stability_refrigerated_days=10,
        notes=[
            "Research doses often 100-300 mcg per administration.",
            "Document sleep/wake timing when studying effects.",
        ],
    ),
    Peptide(
        id="follistatin-344",
        name="Follistatin 344",
        aka=[],
        category="Binding protein fragment",
        vial_amount_mg=1.0,
        typical_diluent_ml=1.0,
        storage="Store lyophilized at -20°C long term; 2-8°C short term; reconstituted 2-8°C.",
        stability_refrigerated_days=7,
        notes=[
            "Handle gently; avoid foaming to protect tertiary structure.",
            "Label with short discard date; stability after mixing is limited.",
        ],
    ),
    Peptide(
        id="peg-mgf",
        name="PEG-MGF",
        aka=["PEGylated Mechano Growth Factor"],
        category="IGF variant",
        vial_amount_mg=2.0,
        typical_diluent_ml=2.0,
        storage="Store lyophilized at 2-8°C; reconstituted solution 2-8°C.",
        stability_refrigerated_days=14,
        notes=[
            "Often researched post-resistance exercise; timing is noted in logs.",
            "PEGylation extends half-life; dose frequency may be lower than MGF.",
        ],
    ),
    Peptide(
        id="igf-1-lr3",
        name="IGF-1 LR3",
        aka=["Long R3 IGF-1"],
        category="IGF analog",
        vial_amount_mg=1.0,
        typical_diluent_ml=2.0,
        storage="Store lyophilized at -20°C long term; 2-8°C short term; reconstituted 2-8°C.",
        stability_refrigerated_days=14,
        notes=[
            "Researchers often use acetic acid or bacteriostatic water; follow supplier guidance.",
            "Track glucose levels in research where relevant due to insulin-like activity.",
        ],
    ),
    Peptide(
        id="mots-c",
        name="MOTS-c",
        aka=[],
        category="Mitochondrial peptide",
        vial_amount_mg=10.0,
        typical_diluent_ml=5.0,
        storage="Store lyophilized at -20°C long term; 2-8°C short term; reconstituted 2-8°C.",
        stability_refrigerated_days=14,
        notes=[
            "Research doses vary; log timing relative to meals and exercise.",
            "Avoid repeated freeze-thaw; aliquot if needed.",
        ],
    ),
    Peptide(
        id="aod-derivative-hc",
        name="AOD-9604 (high concentration)",
        aka=["AOD-9604 HC"],
        category="Fragment peptide",
        vial_amount_mg=10.0,
        typical_diluent_ml=2.0,
        storage="Store lyophilized at 2-8°C; reconstituted solution 2-8°C.",
        stability_refrigerated_days=14,
        notes=[
            "Higher-mass vial for extended study durations.",
            "Calculate concentration carefully; label vials with mg/mL post-reconstitution.",
        ],
    ),
]


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
