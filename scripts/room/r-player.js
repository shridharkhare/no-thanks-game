import { set, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { db } from "../utils/firebase.js";

// Function generates new player name if there is no name in local storage
function getPlayerName(roomId, type, callback) {
    const playerNameDialog = document.getElementById('player-name-dialog');

    playerNameDialog.showModal();

    const playerNameInput = document.getElementById('player-name-input');

    const playerNameSubmit = document.getElementById('player-name-submit');

    // When the user clicks the submit button, save the name to local storage
    playerNameSubmit.addEventListener('click', () => {
        if (playerNameInput.value === '') {
            return;
        }
        const playerName = playerNameInput.value;
        let playerId = window.localStorage.getItem('noThanksGamePlayerId');

        if (!playerId) {
            window.localStorage.setItem('noThanksGamePlayerId', 'user-' + self.crypto.randomUUID());
            playerId = window.localStorage.getItem('noThanksGamePlayerId');
        }
        
        window.localStorage.setItem('noThanksGamePlayerId', playerId);
        const localRoomDb = window.localStorage.getItem('noThanksGamePlayerInfo');

        if (localRoomDb) {
            const playerObj = JSON.parse(localRoomDb);
            playerObj[roomId] = playerName;
            window.localStorage.setItem('noThanksGamePlayerInfo', JSON.stringify(playerObj));
        } else {
            const playerObj = {};
            playerObj[roomId] = playerName;
            window.localStorage.setItem('noThanksGamePlayerInfo', JSON.stringify(playerObj));
        }

        // Close the dialog
        playerNameDialog.close();
    });

    // Allow the user to press enter to submit the name
    playerNameInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            playerNameSubmit.click();
        }
    });

    // When the dialog closes, call the callback function
    playerNameDialog.addEventListener('close', () => {
        callback();
    });
}

// Function to get the player name from local storage and update the database
export async function updatePlayerNameInDatabase(playerObj, roomId, type) {
    const localRoomDb = JSON.parse(playerObj);
    // If the player Object doesn't contain the entry for the current room
    if (!localRoomDb[roomId] || localRoomDb[roomId] === '' || localRoomDb.length === 0) {
        // Prompt the user for a name and wait for the dialog to close
        await new Promise(resolve => {
            // Prompt the user for a name and resolve the Promise when the dialog is closed
            getPlayerName(roomId, type, () => {
                resolve();
            });
        });

        const newDBJSON = window.localStorage.getItem('noThanksGamePlayerInfo');
        const newDB = JSON.parse(newDBJSON);

        // Update the database
        set(ref(db, 'rooms/' + type + '/' + roomId + '/members/' + window.localStorage.getItem('noThanksGamePlayerId') + '/name'), newDB[roomId]);
    } else {
            // Update the database
        set(ref(db, 'rooms/' + type + '/' + roomId + '/members/' + window.localStorage.getItem('noThanksGamePlayerId') + '/name'), localRoomDb[roomId]);
    }
}

// Function to add players to the player list
export function showMembers(members) {
    const playerList = document.getElementById('player-list');
    playerList.innerHTML = '';
    // Create 4 blank div
    for (let i = 0; i < 4; i++) {
        const div = document.createElement('div');
        playerList.appendChild(div);
    }

    if (members) {
        for (const [playerId, player] of Object.entries(members)) {
            const playerListItem = document.createElement('article');
            playerListItem.classList.add('player-list-item');
            playerListItem.textContent = player.name;
            playerList.insertBefore(playerListItem, playerList.childNodes[0]);
            playerList.removeChild(playerList.lastElementChild);
        }
    }
}

