import { setInitialTheme } from "./utils/theme.js";
import { db } from "./utils/firebase.js";
import { set, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

setInitialTheme();

const roomTitleText = document.getElementById('room-title');
const roomIdText = document.getElementById('room-id');

export function updateRoomTitle(roomName) {
    roomTitleText.textContent = roomName;
}

export function updateRoomId(roomId) {
    roomIdText.textContent = roomId;
}

// Get the room id from the url
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');

// Get the room name from the database
onValue(ref(db, 'rooms/public/' + roomId + '/roomName'), (snapshot) => {
    const roomName = snapshot.val();
    updateRoomTitle(roomName);
    updateRoomId(roomId);
});


