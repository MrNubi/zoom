const socket = io();
const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const wellcome = document.getElementById("wellcome");
const call = document.getElementById("call");

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;
call.hidden = true;

function handleMuteBtn() {
    myStream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
    muteBtn.innerText = muted ? "Mute" : "Unmute";
    muted = !muted;
}

function handleCameraBtn() {
    myStream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
    cameraBtn.innerText = cameraOff ? "Turn Camera On" : "Turn Camera Off";
    cameraOff = !cameraOff;
}

async function handleCameraChange() {
    await getMedia(camerasSelect.value);
}

async function getMedia(devId) {
    const initialConstraints = { audio: true, video: { facingMode: "user" } };
    const cameraConstraints = { audio: true, video: { deviceId: { exact: devId } } };

    try {
        myStream = await navigator.mediaDevices.getUserMedia(devId ? cameraConstraints : initialConstraints);
        myFace.srcObject = myStream;
        if (!devId) {
            await getCamera();
        }
    } catch (e) {
        console.log(e);
    }
}

async function getCamera() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput");
        const currentCamera = myStream.getVideoTracks()[0];
        camerasSelect.innerHTML = "";
        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if (currentCamera.label === camera.label) {
                option.selected = true;
            }
            camerasSelect.appendChild(option);
        });
    } catch (e) {
        console.log(e);
    }
}

muteBtn.addEventListener("click", handleMuteBtn);
cameraBtn.addEventListener("click", handleCameraBtn);
camerasSelect.addEventListener("input", handleCameraChange);

// Welcome Form
const wellcomeForm = wellcome.querySelector("form");

async function initCall() {
    wellcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}

async function handleWellcomeSubmit(e) {
    e.preventDefault();
    const input = wellcomeForm.querySelector("input");
    await initCall();
    socket.emit("join_room", input.value);
    roomName = input.value;
    input.value = "";
}

wellcomeForm.addEventListener("submit", handleWellcomeSubmit);

// Socket Code
socket.on("wellcome", async () => {
    const offer = await myPeerConnection.createOffer();
    await myPeerConnection.setLocalDescription(offer);
    socket.emit("offer", offer, roomName);
});

socket.on("offer", async (offer) => {
    if (!myPeerConnection) {
        makeConnection();
    }
    await myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    await myPeerConnection.setLocalDescription(answer);
    socket.emit("answer", answer, roomName);
});

socket.on("answer", async (answer) => {
    await myPeerConnection.setRemoteDescription(answer);
});

// RTC Code
function makeConnection() {
    myPeerConnection = new RTCPeerConnection();
    myStream.getTracks().forEach(track => myPeerConnection.addTrack(track, myStream));

    myPeerConnection.addEventListener("icecandidate", (event) => {
        if (event.candidate) {
            socket.emit("ice", event.candidate, roomName);
        }
    });
}

socket.on("ice", async (candidate) => {
    if (candidate) {
        await myPeerConnection.addIceCandidate(candidate);
    }
});
