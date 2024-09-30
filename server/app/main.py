from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth_router, user_router

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


@app.get("/")
def read_root():
    return {"Hello": "World"}
