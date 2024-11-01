const socket = io();
const myFace   = document.getElementById("myFace");
const muteBtn    = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");


let myStream;
let muted = false
let cameraOff =false

function handleMuteBtn(){
    myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    if(!muted){
        muteBtn.innerText="Unmute"
        muted = true
    }else{
         muteBtn.innerText="Mute"
         muted = false

    }
}
function handleCameraBtn(){
    myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    if(!cameraOff){
        cameraBtn.innerText="Turn Camera Off"
        cameraOff=true

    }else{
         cameraBtn.innerText="Turn Camera On"
         cameraOff =false
    }
}
async function handleCameraChange(){
    // myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    // if(!cameraOff){
    //     cameraBtn.innerText="Turn Camera Off"
    //     cameraOff=true

    // }else{
    //      cameraBtn.innerText="Turn Camera On"
    //      cameraOff =false
    // }
    await getMedia(camerasSelect.value)
}

async function getMedia(devId){
    const initialConstraints = {
        audio : true,
        video : { facingMode : "user"}
    };
    const cameraConstraints = {
        audio : true,
        video : {deviceId : { exact : devId}}
    };

    try{
        myStream = await navigator.mediaDevices.getUserMedia( devId? cameraConstraints: initialConstraints)
        myFace.srcObject = myStream
        if(!devId){
            await getCamera();            
        }
        await getCamera();
    }catch(e){
        console.log(e)
    }
}

async function getCamera(){
 try{
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(dev => dev.kind === "videoinput") 
    const curCam = myStream.getVideoTracks()[0];
    cameras.forEach(cam => {
        const option = document.createElement("option")
        option.value = cam.deviceId
        option.innerText = cam.label
        if(curCam.label === cam.label){
            option.selected = true
        }
        camerasSelect.append(option)
    })
    console.log("dev : ",devices)
 }catch(e){
    console.log(e)
 }
}

getMedia()
  muteBtn.addEventListener("click", ()=>handleMuteBtn())
cameraBtn.addEventListener("click", ()=>handleCameraBtn())
camerasSelect.addEventListener("input", ()=>handleCameraChange())