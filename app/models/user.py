from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.database import Base


class User(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)

    nombre = Column(String(100), nullable=False)

    email = Column(String(255), unique=True, nullable=False)

    password_hash = Column(String(255), nullable=False)