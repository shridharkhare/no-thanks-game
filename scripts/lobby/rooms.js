import { set, ref } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { db } from "../firebase.js";

export const isPrivateChkBox = document.getElementById("private");
export const passwordInput = document.getElementById("create-room-password");

// Event listener for the private checkbox
isPrivateChkBox.addEventListener("change", (event) => {
    const checked = event.target.checked;
    if (checked) {
        passwordInput.classList.remove("hidden");
        passwordInput.disabled = false;
    } else {
        passwordInput.classList.add("hidden");
        passwordInput.disabled = true;
    }
});

// Create a test room 
// Set the value of the room
export function writeRoomData(roomId, roomName, password) {
    set(ref(db, 'rooms/' + roomId), {
        roomName: roomName,
        password: password
    });
}