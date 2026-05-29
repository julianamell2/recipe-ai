from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    nombre: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    nombre: str
    email: str

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str