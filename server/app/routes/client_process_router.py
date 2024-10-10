from fastapi import APIRouter, Depends, UploadFile, File, Form
from ..schema.client_process_schema import (
    ProcessCreate,
    ProcessUpdate,
    ProcessResponse,
    StatusEnum,
)
from ..service.client_process_service import ClientProcessService
from ..database import get_db
from sqlalchemy.orm import Session
from ..security.authenticated_user import authenticated_user

router = APIRouter()

@router.post("/", status_code=201)
async def create_process(
    description: str = Form(...),
    client_id: int = Form(...),
    status: StatusEnum = Form(...),
    file: UploadFile = File(...),
    current_user: dict = Depends(authenticated_user),
    db: Session = Depends(get_db),
):
    payload = ProcessCreate(description=description, client_id=client_id, status=status)
    return await ClientProcessService.create(payload, file, current_user["id"], db)

@router.get("/")
def get_all_processes(
    current_user: dict = Depends(authenticated_user),
    db: Session = Depends(get_db),
):
    return ClientProcessService.get_all_processes_by_user_id(current_user["id"], db)

# Diğer route'lar aynı kalacak...