from typing import Dict, List

from pydantic import BaseModel, Field, PositiveFloat


class Citation(BaseModel):
    title: str
    url: str


class Peptide(BaseModel):
    id: str
    name: str
    aka: List[str] = Field(default_factory=list)
    category: str
    vial_amount_mg: PositiveFloat = Field(..., description="Amount of lyophilized powder per vial in mg")
    typical_diluent_ml: PositiveFloat
    storage: str
    typical_protocols: List[str] = Field(default_factory=list)
    notes: List[str]
    benefits: List[str] = Field(default_factory=list)
    side_effects: List[str] = Field(default_factory=list)
    citations: Dict[str, List[Citation]] = Field(default_factory=dict)
