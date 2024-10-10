from pydantic import BaseModel
from typing import Optional
from enum import Enum

class StatusEnum(str, Enum):
    started = "started"
    in_progress = "in_progress"
    completed = "completed"


class ProcessCreate(BaseModel):
    description: str
    client_id: int
    status: StatusEnum
    file_attachment: Optional[str] = None


class ProcessUpdate(BaseModel):
    description: Optional[str] = None
    status: Optional[StatusEnum] = None
    file_attachment: Optional[str] = None


class ProcessResponse(BaseModel):
    id: int
    description: str
    client_id: int
    client_name: str
    client_surname: str
    status: StatusEnum
    file_attachment: Optional[str] = None

    class Config:
        orm_mode = True
