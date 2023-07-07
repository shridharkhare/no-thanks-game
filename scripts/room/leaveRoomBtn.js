import { db } from '../utils/firebase.js';
import { set, ref } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js';

export const leaveRoomBtn = (button, roomId, type) => {
    button.addEventListener('click', async () => {
        set(ref(db, `rooms/${type}/${roomId}/members/${window.localStorage.getItem('noThanksGamePlayerId')}`), null);

        // Remove the player info from the local storage
        const localPlayerInfo = window.localStorage.getItem('noThanksGamePlayerInfo');
        window.localStorage.removeItem('noThanksGamePlayerInfo');
        const localPlayerInfoObj = JSON.parse(localPlayerInfo);

        delete localPlayerInfoObj[roomId];

        window.localStorage.setItem('noThanksGamePlayerInfo', JSON.stringify(localPlayerInfoObj));

        window.location.href = 'lobby.html';
    });
};