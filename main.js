const electron = require("electron")
const url = require("url")
const path = require("path")
const { BrowserWindow, ipcMain } = require("electron")
const getDate = require('./src/modules/getDate')
const { app } = electron

// SET DEFAULT DATE FOR SELECT FROM DB

let todolistDate = getDate()


// DB CONNECTION WITH KNEX 

const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./db/todolo.db"
    },
    useNullAsDefault: true
})


app.on(`ready`, () => {

    const mainWndow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },

        width: 1000,
        height: 700,
        minWidth: 750,
        minHeight: 500,

    })

    mainWndow.loadURL(
        url.format({
            pathname: path.join(__dirname, "src/desktop.html"),
            protocol: "file",
            slashes: true
        })
    )

    mainWndow.setMenuBarVisibility(false)



    mainWndow.webContents.once("dom-ready", () => {

        createDay()
    })

    ipcMain.on("todolist-date", (err, data) => {

        getTodos(data)

        mainWndow.webContents.send("todolist-date", data)

        todolistDate = data

        console.log(todolistDate);


    })

    ipcMain.on('add-todo', (err, todo) => {

        if (new Date(todolistDate) > new Date()) {

            createDay()

        }


        knex('todos').insert({ ...todo, date: todolistDate })

            .then(() => { console.log(todolistDate) })

            .catch(err => {

                console.log(err);

            })
            

    })

    ipcMain.on("delete-todo", (err, todoId) => {

        knex('todos').where('id', todoId).del()

            .catch(err => console.log(err))
    })

    ipcMain.on("set-todo-status", (err, data) => {

        knex('todos').where('id', data.id).update({ status: data.status })

            .catch(err => console.log(err))
    })


    function getDays() {

        knex.select("*").from("days").orderBy('date')

            .then(
                function (datas) {

                    mainWndow.webContents.send(`days`, datas)


                })
            .catch(err => console.log(err))

    }


    function getTodos(date) {

        knex.select("*").from("todos").where("date", date)

            .then(
                function (datas) {
                    mainWndow.webContents.send(`todos`, datas)

                })
            .catch(err => console.log(err))

    }

    function createDay() {

        knex('days').insert({ date: todolistDate, status: "false" })

            .catch((err) => (console.log(err)))

            .finally(() => {

                getDays()

                getTodos(todolistDate)


            })
    }

    //i will update this functinon 
    function updateDayStatus(date) {



        let status = false

        knex.select('status').from('todos').where('date', date)
            .then(datas => {

                datas.map(data => {
                    if (data.status === 'false') {
                        status = false
                        return
                    } else {
                        status = true
                    }
                })

                knex('days').where('date', date).update({ status: `${status}` })

            })
    }





})

