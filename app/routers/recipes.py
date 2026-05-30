from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.recipe import Recipe
from app.models.user import User
from app.security import get_current_user

import json

from app.models.recipe import Recipe
from app.models.ingredient import Ingredient

from app.services.llm_service import generate_recipe

router = APIRouter(
    prefix="/recipes",
    tags=["Recipes"]
)


@router.get("/")
def get_recipes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return (
        db.query(Recipe)
        .filter(Recipe.usuario_id == current_user.id)
        .all()
    )

@router.post("/generate")
def generate_recipe_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    ingredients = (
        db.query(Ingredient)
        .filter(
            Ingredient.usuario_id == current_user.id
        )
        .all()
    )

    if not ingredients:
        return {
            "message": "No tienes ingredientes registrados"
        }

    ingredient_names = [
        ingredient.nombre
        for ingredient in ingredients
    ]

    recipe_data = generate_recipe(
        ingredient_names
    )

    recipe = Recipe(
        nombre_plato=recipe_data["nombre_plato"],

        ingredientes_json=json.dumps(
            recipe_data["ingredientes"]
        ),

        pasos_json=json.dumps(
            recipe_data["pasos"]
        ),

        tiempo_estimado=recipe_data[
            "tiempo_estimado"
        ],

        nivel_dificultad=recipe_data[
            "nivel_dificultad"
        ],

        usuario_id=current_user.id
    )

    db.add(recipe)
    db.commit()
    db.refresh(recipe)

    return recipe