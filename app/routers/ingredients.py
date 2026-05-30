from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.ingredient import Ingredient
from app.models.user import User
from app.schemas.ingredient import IngredientCreate
from app.security import get_current_user
from fastapi import HTTPException

router = APIRouter(
    prefix="/ingredients",
    tags=["Ingredients"]
)


@router.post("/")
def create_ingredient(
    ingredient: IngredientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_ingredient = Ingredient(
        nombre=ingredient.nombre,
        cantidad=ingredient.cantidad,
       usuario_id=current_user.id
    )

    db.add(new_ingredient)
    db.commit()
    db.refresh(new_ingredient)

    return new_ingredient

@router.get("/")
def get_ingredients(
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

    return ingredients

@router.delete("/{ingredient_id}")
def delete_ingredient(
    ingredient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    ingredient = (
        db.query(Ingredient)
        .filter(
            Ingredient.id == ingredient_id,
            Ingredient.usuario_id == current_user.id
        )
        .first()
    )

    if not ingredient:
        raise HTTPException(
            status_code=404,
            detail="Ingrediente no encontrado"
        )

    db.delete(ingredient)
    db.commit()

    return {
        "message": "Ingrediente eliminado"
    }