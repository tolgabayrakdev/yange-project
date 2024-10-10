import os
import uuid
from fastapi import UploadFile, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from ..model import Process, Client
from ..schema.client_process_schema import ProcessCreate, ProcessUpdate
from sqlalchemy import select

UPLOAD_DIR = os.path.join("uploads", "client_documents")
MAX_FILE_SIZE = 3 * 1024 * 1024  # 3MB in bytes

class ClientProcessService:

    @staticmethod
    async def create(payload: ProcessCreate, file: UploadFile, user_id: int, db: Session):
        try:
            client = db.query(Client).filter(Client.id == payload.client_id, Client.user_id == user_id).first()
            if not client:
                raise HTTPException(
                    status_code=404,
                    detail="Client not found or you don't have permission to create a process for this client",
                )

            # Dosya yükleme işlemi
            file_path = None
            if file:
                # Dosya uzantısını kontrol et
                file_extension = os.path.splitext(file.filename)[1].lower()
                if file_extension != '.pdf':
                    raise HTTPException(status_code=400, detail="Only .pdf files are allowed")
                
                # Dosya boyutunu kontrol et
                contents = await file.read()
                if len(contents) > MAX_FILE_SIZE:
                    raise HTTPException(status_code=400, detail="File size should not exceed 3MB")
                
                # Client için özel klasör oluştur
                client_upload_dir = os.path.join(UPLOAD_DIR, str(client.id))
                if not os.path.exists(client_upload_dir):
                    os.makedirs(client_upload_dir)
                
                # Benzersiz dosya adı oluştur
                unique_filename = f"{uuid.uuid4()}{file_extension}"
                file_path = os.path.join(client_upload_dir, unique_filename)
                
                with open(file_path, "wb") as buffer:
                    buffer.write(contents)

            process = Process(
                description=payload.description,
                client_id=payload.client_id,
                status=payload.status,
                file_attachment=file_path,
            )
            db.add(process)
            db.commit()
            db.refresh(process)
            return {"message": "Process created successfully", "process": process}
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def get_all_processes_by_user_id(user_id: int, db: Session):
        try:
            query = (
                select(Process, Client.name, Client.surname, Client.email)
                .join(Client, Process.client_id == Client.id)
                .where(Client.user_id == user_id)
            )
            result = db.execute(query).fetchall()
            
            if result:
                processes = []
                for row in result:
                    process = row.Process.__dict__
                    process['client'] = {
                        'name': row.name,
                        'surname': row.surname,
                        'email': row.email
                    }
                    # Sadece dosya adını döndür
                    if process['file_attachment']:
                        process['file_attachment'] = os.path.basename(process['file_attachment'])
                    processes.append(process)
                return processes
            return []
        except SQLAlchemyError as e:
            print(f"Database error: {str(e)}")  # Hata ayıklama için
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def get_process_by_id(process_id: int, user_id: int, db: Session):
        try:
            process = (
                db.query(Process)
                .join(Client)
                .filter(Process.id == process_id, Client.user_id == user_id)
                .first()
            )
            if not process:
                raise HTTPException(
                    status_code=404,
                    detail="Process not found or you don't have permission to access this process",
                )
            return process
        except SQLAlchemyError:
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def delete(process_id: int, user_id: int, db: Session):
        try:
            process = (
                db.query(Process)
                .join(Client)
                .filter(Process.id == process_id, Client.user_id == user_id)
                .first()
            )
            if not process:
                raise HTTPException(
                    status_code=404,
                    detail="Process not found or you don't have permission to delete this process",
                )

            db.delete(process)
            db.commit()
            return {"message": "Process deleted successfully"}
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )

    @staticmethod
    def update(process_id: int, payload: ProcessUpdate, user_id: int, db: Session):
        try:
            process = (
                db.query(Process)
                .join(Client)
                .filter(Process.id == process_id, Client.user_id == user_id)
                .first()
            )
            if not process:
                raise HTTPException(
                    status_code=404,
                    detail="Process not found or you don't have permission to update this process",
                )

            for key, value in payload.model_dump(exclude_unset=True).items():
                setattr(process, key, value)

            db.commit()
            db.refresh(process)
            return {"message": "Process updated successfully", "process": process}
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(
                status_code=500, detail="An unexpected server error occurred."
            )
