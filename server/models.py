from typing import List, Optional

from pydantic import BaseModel, Field, PositiveFloat


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
    benefits: List[str] = []
    side_effects: List[str] = []
