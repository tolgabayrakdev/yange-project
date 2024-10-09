from pydantic import BaseModel


class ClientCreate(BaseModel):
    name: str
    surname: str
    email: str
    phone: str
    description: str | None = None


class ClientUpdate(BaseModel):
    name: str | None = None
    surname: str | None = None
    email: str | None = None
    phone: str | None = None
    description: str | None = None