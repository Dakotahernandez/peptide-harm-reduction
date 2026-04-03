import os
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, PositiveFloat
from typing import List, Optional, Literal
from starlette.middleware.trustedhost import TrustedHostMiddleware
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware

from models import Peptide


def parse_csv_env(name: str, defaults: List[str]) -> List[str]:
    raw = os.getenv(name, "")
    if not raw.strip():
        return defaults
    parsed = [item.strip() for item in raw.split(",")]
    return [item for item in parsed if item]


def parse_bool_env(name: str, default: bool) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "https://reconstitutionsafety.com",
    "https://www.reconstitutionsafety.com",
    "https://peptide-harm-reduction-1b0odwc93-dakotahernandezs-projects.vercel.app",
]
DEFAULT_ALLOWED_HOSTS = [
    "testserver",
    "localhost",
    "127.0.0.1",
    "reconstitutionsafety.com",
    "www.reconstitutionsafety.com",
    "api.reconstitutionsafety.com",
    ".onrender.com",
]
DEFAULT_PROXY_TRUSTED_HOSTS = ["127.0.0.1"]

ALLOWED_ORIGINS = parse_csv_env("ALLOWED_ORIGINS", DEFAULT_ALLOWED_ORIGINS)
ALLOWED_HOSTS = parse_csv_env("ALLOWED_HOSTS", DEFAULT_ALLOWED_HOSTS)
PROXY_TRUSTED_HOSTS = parse_csv_env("PROXY_TRUSTED_HOSTS", DEFAULT_PROXY_TRUSTED_HOSTS)
ENABLE_PROXY_HEADERS = parse_bool_env("ENABLE_PROXY_HEADERS", True)

app = FastAPI(
    title="Peptide Harm Reduction API",
    description=(
        "Educational endpoints providing non-medical information on peptide reconstitution "
        "and dosing math. For research and harm reduction; not medical advice."
    ),
    version="0.1.0",
)

if ENABLE_PROXY_HEADERS:
    app.add_middleware(ProxyHeadersMiddleware, trusted_hosts=PROXY_TRUSTED_HOSTS)

app.add_middleware(TrustedHostMiddleware, allowed_hosts=ALLOWED_HOSTS)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    if request.url.scheme == "https":
        response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    return response


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
        "Label all vials with peptide name and concentration (mg/mL). Maintain aseptic technique throughout. "
        "Discard any solution exhibiting turbidity, particulate matter, or discoloration."
    )
    return CalculationResponse(
        concentration_mg_per_ml=round(concentration, 4),
        dose_volume_ml=round(dose_volume, 4),
        note=note,
    )


@app.get("/disclaimer")
def disclaimer():
    legal_footer = [
        "This site and its calculators are provided for educational and harm-reduction purposes only. They are not medical advice, diagnosis, or treatment.",
        "No clinician-patient relationship is created. Consult a licensed clinician for personalized guidance.",
        "If you think you may be experiencing a medical emergency, call 911 (US) or your local emergency number.",
        "Information may be incomplete or incorrect and can change over time. You are responsible for verifying units, concentration, sterility, and legality before acting.",
        "External links and citations are provided for reference only. The operators do not control or endorse third-party content.",
        "The site is provided 'as-is' without warranties. To the maximum extent permitted by law, the operators disclaim liability for any injury, loss, or damages arising from use of this site.",
    ]
    return {
        "title": "Educational Use Only",
        "body": (
            "This site shares research-oriented information on peptide reconstitution and dosing math. "
            "It is not medical advice, does not endorse use, and is intended for harm reduction. "
            "Consult a qualified professional for any medical questions."
        ),
        "legal_footer": legal_footer,
    }


@app.get("/health")
def healthcheck():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", "8000")),
        reload=parse_bool_env("UVICORN_RELOAD", True),
    )
