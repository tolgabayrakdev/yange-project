from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from sqlalchemy.orm import Session
from ..model import Client
from ..schema.client_schema import ClientCreate, ClientUpdate


class ClientService:

    @staticmethod
    def create(payload: ClientCreate, db: Session, user_id: int):
        try:
            client = Client(
                name=payload.name,
                surname=payload.surname,
                email=payload.email,
                phone=payload.phone,
                description=payload.description,
                user_id=user_id,
            )
            db.add(client)
            db.commit()
            db.refresh(client)
            return {"message": "Client created successfully", "client": client}
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def get_all_clients_by_user_id(user_id: int, db: Session):
        try:
            clients = db.query(Client).filter(Client.user_id == user_id).all()
            if clients:
                return clients
            raise HTTPException(
                status_code=404,
                detail="Clients not created yet.",
            )
        except SQLAlchemyError:
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def get_client_by_id(client_id: int, user_id: int, db: Session):
        try:
            client = (
                db.query(Client)
                .filter(Client.id == client_id, Client.user_id == user_id)
                .first()
            )
            if not client:
                raise HTTPException(
                    status_code=404,
                    detail="Client not found or you don't have permission to access this client",
                )
            return client
        except SQLAlchemyError:
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def delete(client_id: int, user_id: int, db: Session):
        try:
            client = (
                db.query(Client)
                .filter(Client.id == client_id, Client.user_id == user_id)
                .first()
            )
            if not client:
                raise HTTPException(
                    status_code=404,
                    detail="Client not found or you don't have permission to delete this client",
                )

            db.delete(client)
            db.commit()
            return {"message": "Client deleted successfully"}
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def update(client_id: int, payload: ClientUpdate, user_id: int, db: Session):
        try:
            client = (
                db.query(Client)
                .filter(Client.id == client_id, Client.user_id == user_id)
                .first()
            )
            if not client:
                raise HTTPException(
                    status_code=404,
                    detail="Client not found or you don't have permission to update this client",
                )

            for key, value in payload.model_dump(exclude_unset=True).items():
                setattr(client, key, value)

            db.commit()
            db.refresh(client)
            return {"message": "Client updated successfully", "client": client}
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )
