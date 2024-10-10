from .database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Enum
from datetime import datetime
import enum

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


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    surname = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String, unique=True, index=True)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.now())
    user_id = Column(Integer, ForeignKey("users.id"))


class StatusEnum(enum.Enum):
    started = "Başlatıldı"
    in_progress = "Devam Ediyor"
    completed = "Tamamlandı"

class Process(Base):
    __tablename__ = "processes"

    id = Column(Integer, primary_key=True)
    description = Column(String)
    status = Column(Enum(StatusEnum), default=StatusEnum.started) 
    created_at = Column(DateTime, default=datetime.now())  
    file_attachment = Column(String, nullable=True) 
    client_id = Column(Integer, ForeignKey("clients.id")) 