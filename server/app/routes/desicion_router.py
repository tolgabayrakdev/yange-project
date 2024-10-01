from fastapi import APIRouter, Depends
from ..security.authenticated_user import authenticated_user
from sqlalchemy.orm import Session
from ..schema.desicion_schema import DecisionCreate
from ..database import get_db
from ..service.desicion_service import DesicionService

router = APIRouter()


@router.get("/")
async def get_all_desicion(
    current_user: dict = Depends(authenticated_user),
    db: Session = Depends(get_db),
):
    return DesicionService.get_all_decisions(db, current_user["id"])


@router.post("/")
async def create_desicion(
    decision: DecisionCreate,
    current_user: dict = Depends(authenticated_user),
    db: Session = Depends(get_db),
):
    return DesicionService.create_decision(db, decision)


