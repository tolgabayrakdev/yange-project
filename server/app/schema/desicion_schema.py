from pydantic import BaseModel
from datetime import datetime

class DecisionCreate(BaseModel):
    title: str
    description: str
    alternatives: str
    category: str
    date: datetime



class DecisionUpdate(BaseModel):
    title: str | None
    description: str | None
    alternatives: str | None
    date: datetime
    category: str | None
