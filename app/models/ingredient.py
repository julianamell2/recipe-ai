from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Ingredient(Base):
    __tablename__ = "ingredientes"

    id = Column(Integer, primary_key=True, index=True)

    nombre = Column(String(100), nullable=False)

    cantidad = Column(String(100), nullable=False)

    usuario_id = Column(
        Integer,
        ForeignKey("usuarios.id"),
        nullable=False
    )

    usuario = relationship(
        "User",
        back_populates="ingredientes"
    )

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
 