import { set, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { db } from "../utils/firebase.js";

const roomTitleText = document.getElementById('room-title');
const roomIdText = document.getElementById('room-id');

export function updateRoomTitle(roomName) {
    roomTitleText.textContent = roomName;
}

export function updateRoomId(roomId) {
    roomIdText.textContent = 'Room ID : ' + roomId;
}


