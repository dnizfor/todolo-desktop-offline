const template = document.createElement(`template`)
template.innerHTML = `
<style>

div{
    box-sizing: border-box;
    padding: 10px;
    height: 45px;
    font-size: 15px;
    line-height: 25px;
    position: relative;
 
}
button{
    font-size: 20px;
    border: none;
    position: absolute;
    right: 15px;
}
</style>

<div >
<button>x</button>
<slot/>
</div>`

class TodoCard extends HTMLElement {
    constructor() {

        super()

        this.attachShadow({ mode: `open` })
        this.shadowRoot.appendChild(template.content.cloneNode(true))


        


    }
    connectedCallback() {

          // STATUS AND BACKGROUND

          let missionStatus = this.getAttribute(`status`)

          if (missionStatus === `true`) {
  
              this.shadowRoot.querySelector(`div`).style.backgroundColor = `green`
  
          } else {
  
              this.shadowRoot.querySelector(`div`).style.backgroundColor = `white`
  
          }
  

        // SET BACKGROUNDS AND MISSIONSTATUS WITH CLICK EVENT

        const { ipcRenderer } = require("electron")

        let id = this.getAttribute(`todo-id`)

        this.shadowRoot.querySelector(`div`).addEventListener(`click`, () => {
            

            if (missionStatus === "true") {

                ipcRenderer.send("set-todo-status",{id:id , status : "false" })

                this.shadowRoot.querySelector(`div`).style.backgroundColor = `white`

                this.setAttribute("status", "false")


            }else{

                ipcRenderer.send("set-todo-status",{id:id , status : "true" })

                this.shadowRoot.querySelector(`div`).style.backgroundColor = `green`

                this.setAttribute("status", "true")

            }

            missionStatus = this.getAttribute(`status`)

        })

        // DESTROY WHEN CLICK TO X

        this.shadowRoot.querySelector('button').addEventListener("click", () => {

            ipcRenderer.send("delete-todo", id)

            this.shadowRoot.querySelector("div").remove()

        })


    }
}

window.customElements.define('todo-card', TodoCard)