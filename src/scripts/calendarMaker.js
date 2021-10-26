
const getDate = require('./modules/getDate')

const electron = require("electron")

const { ipcRenderer } = electron

let calendarDays = [{ status: "false", date: getDate() }]

ipcRenderer.on("days", (err, data) => {

    document.getElementById("table-body").innerHTML = ''

    if (data != []) {

        calendarDays = data
    }

    printDaysPreviousMonth()

    printDaysBeforeData()

    printWorkingDays()

    printFutureDays()



})


const date = new Date()


// PRINT DAY OF PREVIOUS MONTH 

function printDaysPreviousMonth() {

    const firstDayOfMounth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const previousMonthDay = [...Array(firstDayOfMounth - 1 ).keys()]

    previousMonthDay.map(() => {

        let element = document.createElement(`cell-card`);

        element.setAttribute("status", "blank")

        document.getElementById(`table-body`).appendChild(element)

    })

}




// PRINT DAY THAT BEFORE FROM DATAS

function printDaysBeforeData() {

    const beforeDataDay = (new Date(calendarDays[0].date)).getDate()

    const beforeDataDayList = [...Array(beforeDataDay - 1).keys()]

    beforeDataDayList.map(data => {

        let element = document.createElement(`cell-card`);

        element.setAttribute("status", "past")

        let child = document.createTextNode(data + 1)

        element.appendChild(child)

        document.getElementById(`table-body`).appendChild(element)

    })

  


}


// PRINT DATA FROM DB

function printWorkingDays() {


    calendarDays.map((data, index) => {

        const dataDate = data.date

        const dataDay = (new Date(data.date)).getDate()

        if (index !== 0) {

            const previousIndexDate = (new Date(calendarDays[index - 1].date)).getDate()

            if (dataDay !== previousIndexDate + 1) {

                const emptyNumber = (dataDay - previousIndexDate - 1)

                const emptyCells = [...Array(emptyNumber).keys()]

                emptyCells.map(data => {

                    let element = document.createElement(`cell-card`);

                    let child = document.createTextNode(previousIndexDate + data + 1)

                    if (new Date().getDate() < (previousIndexDate + data + 1)) {

                        element.setAttribute("status", 'future')

                        element.setAttribute("future-date", new Date().getDate() + data + 1 )
                        
                    }
                    else{

                        element.setAttribute("status", 'false')

                    }

                    element.appendChild(child)

                    document.getElementById(`table-body`).appendChild(element)

                })

            }
        }

        let element = document.createElement(`cell-card`);

        let child = document.createTextNode(dataDay)

        if(new Date() < new Date(dataDate)) {

            element.setAttribute("target",true)   

            element.setAttribute("future-date",new Date(dataDate).getDate())   

            element.setAttribute("status", 'future')

            
            
        }else{

            element.setAttribute("status", 'true')

            element.setAttribute("cell-date", dataDate)
        }                

        element.appendChild(child)

        document.getElementById(`table-body`).appendChild(element)

        console.log(dataDate);




    })





}






// PRINT DAY THAT AFTER FROM TODAY

function printFutureDays() {


    const LastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const LastDataDay =  (new Date(calendarDays[calendarDays.length - 1].date)).getDate()

    if (LastDayOfMonth !== LastDataDay) {

        const futureDayNumber = (LastDayOfMonth - LastDataDay)

        const futureDays = [...Array(futureDayNumber).keys()]

        futureDays.map(data => {

            let element = document.createElement(`cell-card`);

            element.setAttribute("status", 'future')

            element.setAttribute("future-date",LastDataDay + data + 1 )

            let child = document.createTextNode(LastDataDay + data + 1)

            element.appendChild(child)

            document.getElementById(`table-body`).appendChild(element)
        })
    }






}

