import { setInitialTheme } from "./utils/theme.js";
import { db } from "./utils/firebase.js";
import { set, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { updatePlayerNameInDatabase, showMembers } from "./room/r-player.js";
import { updateRoomTitle, updateRoomId } from "./room/r-title.js";

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

leaveRoomButton.addEventListener('click', async () => {
    set(ref(db, `rooms/${type}/${roomId}/members/${window.localStorage.getItem('noThanksGamePlayerId')}`), null);

    // Remove the player info from the local storage
    const localPlayerInfo = window.localStorage.getItem('noThanksGamePlayerInfo');
    window.localStorage.removeItem('noThanksGamePlayerInfo');
    const localPlayerInfoObj = JSON.parse(localPlayerInfo);

    delete localPlayerInfoObj[roomId];

    window.localStorage.setItem('noThanksGamePlayerInfo', JSON.stringify(localPlayerInfoObj));

    window.location.href = 'lobby.html';
});