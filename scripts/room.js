import { setInitialTheme } from "./utils/theme.js";
import { db } from "./utils/firebase.js";
import { set, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

setInitialTheme();

// ==================== ROOM TITLE ====================

const roomTitleText = document.getElementById('room-title');
const roomIdText = document.getElementById('room-id');

export function updateRoomTitle(roomName) {
    roomTitleText.textContent = roomName;
}

export function updateRoomId(roomId) {
    roomIdText.textContent = 'Room ID : ' + roomId;
}

// Get the room id from the url
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const type = urlParams.get('type');

// Get the room name from the database
onValue(ref(db, `rooms/${type}/${roomId}/roomName`), (snapshot) => {
    const roomName = snapshot.val();
    updateRoomTitle(roomName);
    updateRoomId(roomId);
});

// ==================== PLAYER NAME ====================
const currentPlayerName = window.localStorage.getItem('noThanksGamePlayerName') || '';

function getPlayerName() {
    const playerNameDialog = document.getElementById('player-name-dialog');

    playerNameDialog.showModal();

    const playerNameInput = document.getElementById('player-name-input');
    playerNameInput.value = currentPlayerName;

    const playerNameSubmit = document.getElementById('player-name-submit');

    // When the user clicks the submit button, save the name to local storage
    playerNameSubmit.addEventListener('click', () => {
        if (playerNameInput.value === '') {
            return;
        }
        const playerName = playerNameInput.value;
        const playerId = 'user-' + self.crypto.randomUUID();
        window.localStorage.setItem('noThanksGamePlayerName', playerName);
        window.localStorage.setItem('noThanksGamePlayerId', playerId);

        // Close the dialog
        playerNameDialog.close();
    });

    // Allow the user to press enter to submit the name
    playerNameInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            playerNameSubmit.click();
        }
    });

    // When the dialog closes, update the name in the database
    playerNameDialog.addEventListener('close', () => {
        updatePlayerNameInDatabase(playerNameInput.value);
    });
}

function updatePlayerNameInDatabase(playerName) {
    // If the player name is empty, get the player name again
    if (playerName === '') {
        getPlayerName();
        return;
    }

    set(ref(db, 'rooms/' + type + '/' + roomId + '/members/' + window.localStorage.getItem('noThanksGamePlayerId') + '/name'), playerName);
}

updatePlayerNameInDatabase(currentPlayerName);

// ==================== PLAYER LIST ====================

const playerList = document.getElementById('player-list');

// Function to add players to the player list
function showMembers(members) {
    playerList.innerHTML = '';
    // Create 4 blank div
    for (let i = 0; i < 4; i++) {
        const div = document.createElement('div');
        playerList.appendChild(div);
    }

    for (const [playerId, player] of Object.entries(members)) {
        const playerListItem = document.createElement('article');
        playerListItem.classList.add('player-list-item');
        playerListItem.textContent = player.name;
        playerList.insertBefore(playerListItem, playerList.childNodes[0]);
        playerList.removeChild(playerList.lastElementChild);
    }
}

// When a player joins the room, add them to the player list
onValue(ref(db, `rooms/${type}/${roomId}/members`), (snapshot) => {
    const members = snapshot.val();
    showMembers(members);
});

// ==================== GAME ====================

// ==================== LEAVE ROOM ====================
const leaveRoomButton = document.getElementById('leave-room-button');

leaveRoomButton.addEventListener('click', () => {
    set(ref(db, `rooms/${type}/${roomId}/members/${window.localStorage.getItem('noThanksGamePlayerId')}`), null);

    window.localStorage.removeItem('noThanksGamePlayerName');
    window.localStorage.removeItem('noThanksGamePlayerId');

    window.location.href = 'index.html';
});