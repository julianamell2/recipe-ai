from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import ForeignKey

from sqlalchemy.orm import relationship

from app.database import Base


class Recipe(Base):
    __tablename__ = "recetas"

    id = Column(Integer, primary_key=True, index=True)

    nombre_plato = Column(String(255), nullable=False)

    ingredientes_json = Column(Text, nullable=False)

    pasos_json = Column(Text, nullable=False)

    tiempo_estimado = Column(String(100))

    nivel_dificultad = Column(String(50))

    usuario_id = Column(
        Integer,
        ForeignKey("usuarios.id"),
        nullable=False
    )

    usuario = relationship("User")