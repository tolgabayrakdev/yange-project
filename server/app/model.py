from .database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Enum
from datetime import datetime
import enum


class OutcomeType(enum.Enum):
    positive = "positive"
    negative = "negative"


class DecisionCategory(enum.Enum):
    business = "business"
    finance = "finance"
    personal = "personal"
    other = "other"


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.now())


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now())
    role_id = Column(Integer, ForeignKey("roles.id"), default=1)


class Desicion(Base):
    __tablename__ = "decisions"

    id = Column(Integer, primary_key=True)
    title = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=False)
    category = Column(Enum(DecisionCategory), nullable=False)
    created_at = Column(DateTime, default=datetime.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)


class Outcome(Base):
    __tablename__ = "outcomes"

    id = Column(Integer, primary_key=True)
    outcome_type = Column(Enum(OutcomeType), nullable=False)
    impact = Column(String, nullable=False)
    notes = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now())
    decision_id = Column(Integer, ForeignKey("decisions.id"), nullable=False)
