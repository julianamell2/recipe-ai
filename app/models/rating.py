from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import ForeignKey

from app.database import Base


class Rating(Base):
    __tablename__ = "calificaciones"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    puntuacion = Column(
        Integer,
        nullable=False
    )

    usuario_id = Column(
        Integer,
        ForeignKey("usuarios.id"),
        nullable=False
    )

    receta_id = Column(
        Integer,
        ForeignKey("recetas.id"),
        nullable=False
    )