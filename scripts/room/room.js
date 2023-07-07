import { setInitialTheme } from "../utils/theme.js";
import { db } from "../utils/firebase.js";
import { get, set, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { updatePlayerNameInDatabase, showMembers } from "./r-player.js";
import { updateRoomTitle, updateRoomId } from "./r-title.js";
import { startGame } from "./game.js";

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

// ==================== START GAME ====================
const startGameButton = document.getElementById('start-game-button');

// At least 4 players are needed to start the game
startGameButton.disabled = true;

// Set the inner html of the button to startGameCount
onValue(ref(db, `rooms/${type}/${roomId}/startGameCount`), (snapshot) => {
    const startGameCount = snapshot.val();
    if (startGameCount && startGameCount < 4) {
        startGameButton.textContent = `${startGameCount}/4 Ready`;
    } else {
        startGameButton.textContent = 'Game is already in progress...';
        startGameButton.disabled = true;
        const gameCanvas = document.getElementById("game-canvas");
        gameCanvas.classList.remove("hidden");
    }
});

// Check the number of players in the room
onValue(ref(db, `rooms/${type}/${roomId}/members`), (snapshot) => {
    const members = snapshot.val();
    const membersCount = Object.keys(members).length;

    if (membersCount >= 4) {
        startGameButton.disabled = false;
    } else {
        startGameButton.disabled = true;
    }
});

startGameButton.addEventListener('click', async () => {
    // Increase the startGameCount
    const startGameCountRef = ref(db, `rooms/${type}/${roomId}/startGameCount`);
    const startGameCountSnapshot = await get(startGameCountRef);
    const startGameCount = startGameCountSnapshot.val() + 1;
    set(startGameCountRef, startGameCount);

    // Start the game if 4 players are ready
    if (startGameCount === 4) {
        startGame(roomId);
    }

    // Update the button text to show how many of 4 players are ready
    startGameButton.textContent = `${startGameCount}/4 Ready`;
    startGameButton.disabled = true;
});