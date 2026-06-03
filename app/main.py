from fastapi import FastAPI

from app.database import Base
from app.database import engine

from app.models.user import User
from app.routers.auth import router as auth_router

#Prueba temporalmente
from app.security import get_current_user
from fastapi import Depends
from app.models.ingredient import Ingredient
from app.routers.ingredients import router as ingredients_router
from app.models.recipe import Recipe
from app.routers.recipes import router as recipes_router
from app.models.rating import Rating
from app.routers.ratings import router as ratings_router
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Recipe AI API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:5501",
        "http://localhost:5501"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(ingredients_router)
app.include_router(recipes_router)
app.include_router(ratings_router)

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