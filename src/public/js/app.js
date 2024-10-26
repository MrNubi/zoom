const msgList   = document.querySelector("ul");
const msgForm = document.querySelector("form");
const socket = new WebSocket(`ws://${window.location.host}`)

/**
 * @param {SubmitEvent} message - 제출 이벤트
 */
function handleSubmit(message){
    message.preventDefault();
    const input = msgForm.querySelector("input");
    console.log(input.value)
    socket.send(input.value)
    input.value=""
}




socket.addEventListener("open", (e)=>{
  console.log("connect to server  :  ", e)
})
socket.addEventListener("message", (e)=>{
    console.log("msg, ",e.data)
})
socket.addEventListener("close", (e)=>{
    console.log("close",e)
})
//setTimeout(()=>socket.send("브라우저 메세지"),100)



msgForm.addEventListener("submit",handleSubmit)