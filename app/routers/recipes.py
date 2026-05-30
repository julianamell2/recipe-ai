from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.recipe import Recipe
from app.models.user import User
from app.security import get_current_user

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