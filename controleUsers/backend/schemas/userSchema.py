from pydantic import BaseModel

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    idade: int
    email: str
    senha: str

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    idade: int
    email: str
    senha: str

class PasswordVerify(BaseModel):
    senha: str

class UserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    idade: int | None = None
    email: str | None = None