from fastapi import FastAPI

from app.database import Base
from app.database import engine

from app.models.user import User
from app.routers.auth import router as auth_router

#Prueba temporalmente
from app.security import get_current_user
from fastapi import Depends

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Recipe AI API"
)

app.include_router(auth_router)

@app.get("/")
def root():
    return {"message": "Recipe AI funcionando"}

#enpoint prueba
@app.get("/me")
def me(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "nombre": current_user.nombre,
        "email": current_user.email
    }