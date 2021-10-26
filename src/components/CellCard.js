const cellTemplate = document.createElement(`template`)
cellTemplate.innerHTML = `
<style>

div{
    box-sizing: border-box;
    margin: 0;
    padding:0 ; 
    height: calc(86vh / 5);
    width: calc( 80vw  / 7);
    display: flex;
    justify-content: center;
    align-items: center;
 
}
img{
    width : 50px
 
}


</style>

<div >
<slot/>
</div>
`

class CellCard extends HTMLElement {
    constructor() {
        super()

        this.attachShadow({ mode: `open` })
        this.shadowRoot.appendChild(cellTemplate.content.cloneNode(true))


    }

    connectedCallback() {

        const electron = require("electron")

        const { ipcRenderer } = electron


        // SET BACKGROUND COLOR BY STATUS

        const status = this.getAttribute("status")

        console.log(status)

        if (status === "blank") {

            this.shadowRoot.querySelector('div').style.backgroundColor = `white`

        } else if (status === "past") {

            this.shadowRoot.querySelector('div').style.backgroundColor = `#e9e9e9`

        } else if (status === "true") {

            this.shadowRoot.querySelector('div').style.backgroundColor = `green`

        } else if (status === "false") {

            this.shadowRoot.querySelector('div').style.backgroundColor = `red`

        } 
        


        // SEND LEFT-TODOLIST DATE TO  BACKEND 

        const cellDate = this.getAttribute("cell-date")

        this.shadowRoot.querySelector("div").addEventListener("click", () => {

            if (cellDate != null) {

                ipcRenderer.send("todolist-date", cellDate)

            }

        })

        // SET TARGET FOR FUTURE

        const futureDate = this.getAttribute("future-date")

        const makeDate = require("./modules/makeDate")

        this.shadowRoot.querySelector("div").addEventListener("click", () => {

            if (futureDate != null) {

                ipcRenderer.send("todolist-date", makeDate(futureDate))

                ipcRenderer.send("create-target-day", makeDate(futureDate))

            }


        })

        const targetStatus = this.getAttribute('target')

        if (targetStatus ===  "true") {

            this.shadowRoot.querySelector('div').innerHTML= `<img src="../public/target.png" alt="target">`

            
        }







    }
}

window.customElements.define('cell-card', CellCard)