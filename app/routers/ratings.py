from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.rating import Rating
from app.models.recipe import Recipe
from app.models.user import User

from app.schemas.rating import RatingCreate

from app.security import get_current_user

router = APIRouter(
    prefix="/ratings",
    tags=["Ratings"]
)

@router.post("/")
def create_rating(
    rating: RatingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    recipe = (
        db.query(Recipe)
        .filter(
            Recipe.id == rating.receta_id
        )
        .first()
    )

    if not recipe:
        raise HTTPException(
            status_code=404,
            detail="Receta no encontrada"
        )

    new_rating = Rating(
        puntuacion=rating.puntuacion,
        usuario_id=current_user.id,
        receta_id=rating.receta_id
    )

    db.add(new_rating)
    db.commit()
    db.refresh(new_rating)

    return new_rating

@router.get("/")
def get_ratings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return (
        db.query(Rating)
        .filter(
            Rating.usuario_id == current_user.id
        )
        .all()
    )