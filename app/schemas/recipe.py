from pydantic import BaseModel


class RecipeResponse(BaseModel):
    id: int
    nombre_plato: str
    ingredientes_json: str
    pasos_json: str
    tiempo_estimado: str | None = None
    nivel_dificultad: str | None = None

    class Config:
        from_attributes = True