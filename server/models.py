from pydantic import BaseModel, Field, PositiveFloat


class Citation(BaseModel):
    title: str
    url: str


class Peptide(BaseModel):
    id: str
    name: str
    aka: list[str] = Field(default_factory=list)
    category: str
    vial_amount_mg: PositiveFloat = Field(..., description="Amount of lyophilized powder per vial in mg")
    typical_diluent_ml: PositiveFloat
    storage: str
    typical_protocols: list[str] = Field(default_factory=list)
    notes: list[str]
    benefits: list[str] = Field(default_factory=list)
    side_effects: list[str] = Field(default_factory=list)
    citations: dict[str, list[Citation]] = Field(default_factory=dict)
