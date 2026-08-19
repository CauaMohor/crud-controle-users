from database.db import get_connection
from models.user import User

def createTable():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            idade INTEGER NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL
        )    
    ''')

    conn.commit()
    conn.close()

def createUser(user):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO user (first_name, last_name, idade, email, senha)
        VALUES (?, ?, ?, ?, ?)    
    ''', (user.first_name, user.last_name, user.idade, user.email, user.senha))

    conn.commit()
    conn.close()

def changeUser(id: int, user):
    dados = user.model_dump(exclude_unset=True)
    if not dados: return False

    campos = []
    valores = []

    for campo, valor in dados.items():
        campos.append(f"{campo} = ?")
        valores.append(valor)

    valores.append(id)

    sql = f""" UPDATE user SET {', '.join(campos)} WHERE id = ? """

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(sql, valores)
    conn.commit()
    conn.close()

def deleteUser(id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute('''
        DELETE FROM user
        WHERE id = ?
    ''', (id,))

    conn.commit()
    conn.close()

def listUsers():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT * FROM user ORDER BY first_name
    ''')
    rows = cursor.fetchall()

    users = []
    for row in rows:
        users.append(User(row[0], row[1], row[2], row[3], row[4], row[5]))

    conn.close()
    return users

def getUser(id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute('''
            SELECT * FROM user
            WHERE id = ?  
        ''', (id,))
    row = cursor.fetchone()

    user = User(row[0], row[1], row[2], row[3], row[4], row[5])
    conn.close()
    return user

def getPassword(user, senha: str):
    if user.senha != senha:
        return False
    return True


