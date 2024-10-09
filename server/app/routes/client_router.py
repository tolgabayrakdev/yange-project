from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schema.client_schema import ClientCreate, ClientUpdate
from ..service.client_service import ClientService
from ..security.authenticated_user import authenticated_user

router = APIRouter()


@router.post("/", status_code=201)
def create_client(
    payload: ClientCreate,
    current_user: dict = Depends(authenticated_user),
    db: Session = Depends(get_db),
):
    return ClientService.create(payload, db, current_user["id"])


@router.get("/")
def get_all_clients(
    current_user: dict = Depends(authenticated_user),
    db: Session = Depends(get_db),
):
    return ClientService.get_all_clients_by_user_id(current_user["id"], db)


@router.get("/{client_id}")
def get_client_by_id(
    client_id: int,
    current_user: dict = Depends(authenticated_user),
    db: Session = Depends(get_db),
):
    return ClientService.get_client_by_id(client_id, current_user["id"], db)


@router.delete("/{client_id}")
def delete_client(
    client_id: int,
    current_user: dict = Depends(authenticated_user),
    db: Session = Depends(get_db),
):
    return ClientService.delete(client_id, current_user["id"], db)


@router.put("/{client_id}")
def update_client(
    client_id: int,
    payload: ClientUpdate,
    current_user: dict = Depends(authenticated_user),
    db: Session = Depends(get_db),
):
    return ClientService.update(client_id, payload, current_user["id"], db)
