from pydantic import BaseModel


class IngredientCreate(BaseModel):
    nombre: str
    cantidad: str


class IngredientResponse(BaseModel):
    id: int
    nombre: str
    cantidad: str

    class Config:
        from_attributes = True