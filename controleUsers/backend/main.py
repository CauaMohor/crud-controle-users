from services import userService
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas.userSchema import UserCreate, UserResponse, PasswordVerify, UserUpdate

app = FastAPI()
userService.createTable()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/users")
def list_users():
    return userService.listUsers()

@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate):
    userService.createUser(user)
    return {"msg": "User criado"}

@app.put("/users/{id}")
def update_user(id: int, user: UserUpdate):
    userService.changeUser(id, user)
    return {"msg": "User alterado"}

@app.delete("/users/{id}")
def delete_user(id: int):
    userService.deleteUser(id)
    return {"msg": "User deletado"}


@app.post("/users/{id}/get-password")
def get_password(id: int, data: PasswordVerify):
    user = userService.getUser(id)

    if not user:
        raise HTTPException(status_code=404, detail="User não encontrado")

    autorizado = userService.getPassword(user, data.senha)

    if not autorizado:
        raise HTTPException(status_code=401, detail="Senha incorreta")

    return {"authorized": True}
