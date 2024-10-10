from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth_router, user_router, client_router, client_process_router

from . import model
from .database import engine

model.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["http://localhost:5173", "https://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router=auth_router.router, prefix="/api/auth")
app.include_router(router=user_router.router, prefix="/api/user")
app.include_router(router=client_router.router, prefix="/api/clients")
app.include_router(router=client_process_router.router, prefix="/api/processes")

# Statik dosya yolunu ekle
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"Hello": "World"}
