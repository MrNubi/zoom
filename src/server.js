import express from "express";
import http from 'http'
import { Server } from "socket.io";
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
const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);


httpServer.listen(3000,handleListen);


// let roomIn;
// wsServer.on("connection",(socket)=>{
//     // console.log(socket);
//     socket.onAny((e)=>{
//         console.log(`Socket Event: ${e}`)
//     })
//     socket.on("enter_room", (roomName, fn)=>{
//         const rm = roomName.payload
//         console.log(rm);
//         socket.join(rm);
//         console.log("socket.room: ",socket.rooms);
//         //fn 은 프론트에서보내는 콜백함수, 서버에서 실행 X
//         // 콜백함수는 항상 마지막이어야함
//         // 백엔드에서 인자를 넣어서 보내줄 수있음
//         fn();
//         socket.to(rm).emit("welcome")
//     })
//     socket.on("disconnecting", ()=>{
        
//         socket.rooms.forEach(room => socket.to(room).emit("bye"));
//     })
//     socket.on("new_msg", (msg,room,fn)=>{
        
//          socket.to(room).emit("new_msg",msg);
//          fn();
//     })
// })
// const wss = new WebSocket.Server({server})

// // 연결 시 연결자들의 집합
// const sockets = []


// //webSocket은 이벤트를 받아서 처리하는 식, event의 종류에 주의할 것
// // 콜백으로 받는 socket은 연결된 브라우저와의 연결라인
// // on method 는 연결된 브라우저의 정보를 socket을 통해 제공



// wss.on("connection", (socket) => {
  
//     //sockets.push({id:"", socket:socket});
//     sockets.push(socket);
//     socket["nickname"] = "Anon"
//     console.log("클라이언트와 연결");
//     // socket 안의 메서드로 클라이언트에 메세지 전송
//    socket.send("hello");
//    socket.on("close",()=>{
//     console.log("연결꺼짐")
//    })
//    socket.on("message",(e)=>{

//     const msg = JSON.parse(e.toString('utf-8'))
//     console.log(msg,)

//     switch(msg.type){
//         case "nickname":
//             console.log("n, ",msg.payload)
//             socket["nickname"] = msg.payload
//             break
//         case "new_message":
        
//             sockets.forEach((userSocket)=>userSocket.send(`${socket.nickname}:  ${msg.payload}`))
//             break
//     }


    
//     //socket.send(msg)
// })

// })

