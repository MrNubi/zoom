const msgList   = document.querySelector("ul");
const msgForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");
const socket = new WebSocket(`ws://${window.location.host}`)

/**
 * @param {SubmitEvent} message - 제출 이벤트
 */
function handleSubmit(message){
    message.preventDefault();
    const input = msgForm.querySelector("input");
    console.log(input.value)
    socket.send(makeMsg("new_message", input.value))
    input.value=""
}
function nickSubmit(e){
    e.preventDefault();
    const input = nickForm.querySelector("input");
    console.log(input.value)
    socket.send(makeMsg("nickname", input.value))
        const li = document.createElement("li");
    li.innerText =`You: ${input.value}`;
    msgList.append(li);
    input.value=""
}

function makeMsg(type,payload){
    const msg = {type,payload};
    return JSON.stringify(msg);
}


socket.addEventListener("open", (e)=>{
  console.log("connect to server  :  ", e)
})
socket.addEventListener("message", (res)=>{
    const li = document.createElement("li");
    li.innerText = res.data;
    msgList.append(li);
})
socket.addEventListener("close", (e)=>{
    console.log("close",e)
})
//setTimeout(()=>socket.send("브라우저 메세지"),100)



msgForm.addEventListener("submit",handleSubmit)
nickForm.addEventListener("submit",nickSubmit)