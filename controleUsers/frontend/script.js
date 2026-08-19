const api = "http://localhost:8000/users";

const form = document.getElementById("form")

const firstName = document.getElementById("first-name")
const lastName = document.getElementById("last-name")
const age = document.getElementById("age")
const email = document.getElementById("email")
const password = document.getElementById("password")
const confirmPassword = document.getElementById("confirm-password")
const table = document.getElementById("table")
const popup = document.querySelectorAll(".box-popup")
const body = document.querySelector("body")

// função para carregar os users (GET)
function loadUsers(){
    table.innerHTML = `
        <tr>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>Idade</th>
            <th>Email</th>
            <th></th>
            <th></th>
        </tr>
    `


    fetch(api)
    .then(res => res.json())
    .then(users => {
        users.forEach((user, index) => {
            const tr = document.createElement("tr")

            tr.innerHTML = `
                <td>${user.first_name}</td>
                <td>${user.last_name}</td>
                <td>${user.idade}</td>
                <td>${user.email}</td>
                <td>
                    <button onclick="editUser(${user.id}, 'edit')">Editar</button>
                </td>
                <td>
                    <button onclick="editUser(${user.id}, 'delete')">Excluir</button>
                </td>
            `

            if (index % 2 != 0){
                tr.classList.add("alter-color")
            }
            table.appendChild(tr)
        });
    })
}


// evento de criação para novo user (POST)
form.addEventListener("submit", e => {
    e.preventDefault()

    const user = {
        first_name: firstName.value,
        last_name: lastName.value,
        idade: Number(age.value),
        email: email.value,
        senha: password.value
    }

    if (user.senha == confirmPassword.value){
        fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
        })

        form.reset()
        loadUsers()
    } else {
        alert("Campos de senhas estão divergentes!")
    }

})

// Função para iniciar a edição do user
const formPassword = document.querySelector("#form-senha")

let currentUserId = null
let currentAction = null
let scrollY = 0

function editUser(id, action){
    currentUserId = id
    currentAction = action
    scrollY = window.scrollY.toFixed()
    popup[0].style.marginTop  = `${scrollY}px`
    popup[0].classList.add("activate")
    body.style.overflowY = 'hidden'
}

// Chama a verificação de senha
formPassword.addEventListener("submit", (e) => {
    e.preventDefault()
    console.log(currentAction)

    if (currentUserId === null || currentAction === null) return

    insertPassword(currentUserId).then((authorized) => {

        if (!authorized) return;

        popup[0].classList.remove("activate")

        if (currentAction == 'edit') {
            popup[1].style.marginTop  = `${scrollY}px`
            popup[1].classList.add("activate")

            // Chama a atualização do user
            const formChange = document.querySelector("#form-change")
            formChange.addEventListener("submit", (e) => {
                e.preventDefault()
                updateUser(currentUserId)
                formChange.reset()
            })
        }

        if (currentAction === 'delete') {
            deleteUser(currentUserId);
            body.style.overflowY = 'scroll'
        }
    })

    formPassword.reset()
})

// Função para fazer a verificação da senha do user
async function insertPassword(id){
    const verifyPassword = document.querySelector("#verify-password").value
    const resp = await fetch(`${api}/${id}/get-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha: verifyPassword })
    })

    if (!resp.ok){
        alert("Senha Incorreta!!")
        return false   
    }

    return true
}

// Função para atualizar algum user (PUT)
function updateUser(id){
    const changeFirstName = document.getElementById("change-name")
    const changeLastName = document.getElementById("change-last-name")
    const changeAge = document.getElementById("change-age")
    const changeEmail = document.getElementById("change-email")

    const user = {}

    if (changeFirstName.value) user.first_name = changeFirstName.value
    if (changeLastName.value) user.last_name = changeLastName.value
    if (changeAge.value) user.idade = Number(changeAge.value)
    if (changeEmail.value) user.email = changeEmail.value

    fetch(`${api}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    })

    popup[1].classList.remove("activate")
    body.style.overflowY = 'scroll'
    loadUsers()
}

// Função para excluir algum user (DELETE)
function deleteUser(id){
    fetch(`${api}/${id}`,{
        method: "DELETE"
    }).then(() => loadUsers())
}

// Função para fechar os popup
const closes = document.querySelectorAll(".close-popup")

closes.forEach(close => {
    close.addEventListener("click", e => {
        e.preventDefault()
        closePopup()
    })
})



function closePopup(){
    if (popup[1].classList.contains("activate")){
        popup[1].classList.remove("activate")
    } else {
        popup[0].classList.remove("activate")
    }
    body.style.overflowY = 'scroll'
}

loadUsers()
