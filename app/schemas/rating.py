from pydantic import BaseModel


class RatingCreate(BaseModel):
    receta_id: int
    puntuacion: int