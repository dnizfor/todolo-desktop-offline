
ipcRenderer.on("todolist-date", (err, todolistDate) => {

    todolistDate = new Date(todolistDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })


    document.getElementById("todolist-date").innerHTML = todolistDate


})

let todolist = [] //  TODOS >>> { status: "false", date: `123`, id: `123`, todo: "ASASAS" }

ipcRenderer.on("todos", (err, data) => {

    if (data != []) {

        todolist = data
    }

    printTodos()

})

// ADD TODO TO TODOLIST

document.getElementById(`todolist-submit`).addEventListener(`click`, (e) => {

    const missionName = document.getElementById(`todolist-input`).value

    ipcRenderer.send("add-todo", { status: "false", todo: missionName })

    todolist.push({ status: "false", date: `null`, id: `null`, todo: missionName })

    const element = document.createElement(`todo-card`);

    element.setAttribute('status', "false")

    const text = document.createTextNode(missionName)

    element.appendChild(text)

    document.getElementById(`todolist-body`).appendChild(element)

    document.getElementById(`todolist-input`).value = ``

    e.preventDefault()

})



// PRINT  MISSIONS OF DAY INTO TODOLIST

function printTodos() {

    const todolistBody = document.getElementById(`todolist-body`)

    todolistBody.innerHTML = ""

    todolist.map(data => {

        const element = document.createElement(`todo-card`);

        element.setAttribute('status', data.status)

        element.setAttribute(`todo-id`, data.id)

        const text = document.createTextNode(data.todo)

        element.appendChild(text)

        todolistBody.appendChild(element)

    })

}




