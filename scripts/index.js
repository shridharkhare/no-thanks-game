import { setInitialTheme } from "./theme.js";
import { startShuffle } from "./hero/hero.js";

setInitialTheme();

startShuffle();

// Event listeners for landing page
const lobbyButton = document.getElementById("lobby-btn");

lobbyButton.addEventListener("click", () => {
    window.location.href = "./lobby.html";
});