import express from "express";
import http from 'http'
import WebSocket from "ws";
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname+"/views");

app.use("/public", express.static(__dirname+"/public"));

app.get("/", (req,res)=> {
    res.render("home");
}) 
// URL 하나만 쓸 것 => 모든 url 리다이렉트 홈
app.get("/*", (req,res)=> {
    res.redirect("/");
}) 

console.log("hello");
// http랑 ws랑 합쳐서 한 서버에서 운영
// express 자체에서는 ws를 지원 안하기에 function을 통해 ws를 깔아줘야함
// node.js의 http package 사용

const handleListen = () => console.log("Listening on http://localhost:3000");
const handleListenWs = () => console.log("Listening on ws://localhost:3000");


// 같은 포트위에서 웹소켓 서버와 http서버를 동시에 돌리기 위해 작성 
// 
const server = http.createServer(app);

const wss = new WebSocket.Server({server})

//webSocket은 이벤트를 받아서 처리하는 식, event의 종류에 주의할 것
// 콜백으로 받는 socket은 연결된 브라우저와의 연결라인
// on method 는 연결된 브라우저의 정보를 socket을 통해 제공

const onSocketMessage = (e)=>{
    console.log(e.toString('utf-8'))
}

wss.on("connection", (socket) => {
   console.log("클라이언트와 연결");
    // socket 안의 메서드로 클라이언트에 메세지 전송
   socket.send("hello");
   socket.on("close",()=>{
    console.log("연결꺼짐")
   })
   socket.on("message",onSocketMessage)

})

server.listen(3000,handleListen);