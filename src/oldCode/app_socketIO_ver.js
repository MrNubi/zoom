const socket = io();

const welcome   = document.getElementById("welcome");
const form = document.querySelector("form");
const room = document.getElementById("room");
const chat = document.getElementById("chat");

room.hidden=true
let roomName;

const handleMsgSubmit = (e) =>{
    e.preventDefault()
   const input = room.querySelector("input");
   socket.emit("new_msg", input.value, roomName, ()=>{
    addMsg(`You: ${input.value}`)
   })

}

function showRoom(){
    console.log("carry on")
    welcome.hidden=true
    room.hidden=false
    const h3 = room.querySelector("h3")
    h3.innerText = "Room "+roomName;

    const formInRoom = room.querySelector('form')
    formInRoom.addEventListener("submit",handleMsgSubmit)
}

const addMsg = (msg)=>{
    console.log(msg)
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = `${msg}`
    ul.append(li);
}

const handleRoomSubmit = (e) =>{
    e.preventDefault()
    input = form.querySelector("input");
    roomName = input.value
    socket.emit("enter_room", {payload: input.value},showRoom)
    input.value = ""
}

form.addEventListener("submit", handleRoomSubmit)
socket.on("welcome",()=>{
    addMsg("Here Comes New Challenger!!!")
})
socket.on("bye",()=>{
    addMsg("goodBye")
})
socket.on("new_msg",(msg)=>{
    addMsg("Others : " + msg)
})