import { get, set, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { db } from "../utils/firebase.js";
import { Game } from "./game/game.js";

export const startGameBtn = (button, roomId, type) => {
    // Check if the game has already started
    const gameStartedRef = ref(db, `rooms/${type}/${roomId}/gameStarted`);

    onValue(gameStartedRef, (snapshot) => {
        if (snapshot.val() === true) {
            button.disabled = true;
            button.innerHTML = "Game is in progress...";
            console.log("Game is in progress...");
        } else {
            // Check if the room has enough players
            onValue(ref(db, `rooms/${type}/${roomId}/members`), (snapshot) => {
                const members = snapshot.val();
                const membersCount = Object.keys(members).length;

                // If there aren't enough players, disable the button, set the text to "Waiting for players..."
                if (membersCount < 4) {
                    button.disabled = true;
                    button.innerHTML = "Waiting for players...";
                } else {
                    // If there are enough players, Check how many players are ready
                    onValue(ref(db, `rooms/${type}/${roomId}/startGameCount`), (snapshot) => {
                        const startGameCount = snapshot.val();

                        // If less than 4 players are ready, enable the button, set the text to "Start Game, (X/4) players ready"
                        if (startGameCount < 4) {
                            button.disabled = false;
                            button.innerHTML = `Start Game (${startGameCount}/4)`;

                            // Attach a click event listener to the button
                            button.addEventListener("click", async () => {
                                // Increment the startGameCount
                                await set(ref(db, `rooms/${type}/${roomId}/startGameCount`), startGameCount + 1);
                                // Disable the button
                                button.disabled = true;
                            });
                        } else {
                            const game = new Game();
                            game.startGame(roomId, type);
                            button.disabled = true;
                            set(ref(db, `rooms/${type}/${roomId}/gameStarted`), true);
                            const gameCanvas = document.getElementById('game-canvas');
                            gameCanvas.classList.remove('hidden');
                        }
                    });
                }
            });
        };
    });
};
