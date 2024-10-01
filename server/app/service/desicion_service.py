from sqlalchemy.orm import Session
from ..model import Desicion
from ..schema.desicion_schema import DecisionCreate
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError


class DesicionService:

    @staticmethod
    def get_desicion(db: Session, decision_id: int):
        return db.query(Desicion).filter(Desicion.id == decision_id).first()

    @staticmethod
    def get_all_decisions(db: Session, user_id: int):
        return db.query(Desicion).filter(Desicion.user_id == user_id).all()

    @staticmethod
    def create_decision(db: Session, decision: DecisionCreate):
        try:
            desicion = Desicion(**decision.dict())
            db.add(desicion)
            db.commit()
            db.refresh(desicion)
            return desicion
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )
