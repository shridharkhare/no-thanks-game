import { setInitialTheme } from "../utils/theme.js";
import { db } from "../utils/firebase.js";
import { get, set, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { updatePlayerNameInDatabase, showMembers } from "./r-player.js";
import { updateRoomTitle, updateRoomId } from "./r-title.js";
import { startGameBtn } from "./startGameBtn.js";
import { leaveRoomBtn } from "./leaveRoomBtn.js";

// Theme
setInitialTheme();

//Get room params from URL
export const urlParams = new URLSearchParams(window.location.search);
export const roomId = urlParams.get('roomId');
export const type = urlParams.get('type');

// Get the room name from the database and update the room title
onValue(ref(db, `rooms/${type}/${roomId}/roomName`), (snapshot) => {
    const roomName = snapshot.val();
    updateRoomTitle(roomName);
    updateRoomId(roomId);
});

// Update the player name in the database
const currentPlayerObj = window.localStorage.getItem('noThanksGamePlayerInfo') || JSON.stringify({});
updatePlayerNameInDatabase(currentPlayerObj, roomId, type);

// Get the members from the database and show them
onValue(ref(db, `rooms/${type}/${roomId}/members`), (snapshot) => {
    const members = snapshot.val();
    showMembers(members);
});

// ==================== LEAVE ROOM ====================
const leaveRoomButton = document.getElementById('leave-room-button');

leaveRoomBtn(leaveRoomButton, roomId, type);

const startGameButton = document.getElementById('start-game-button');

startGameBtn(startGameButton, roomId, type);