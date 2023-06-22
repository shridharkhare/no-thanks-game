import { set, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
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

export function createRoom(roomId, roomName, password, type) {
    if (type === "public") {
        set(ref(db, 'rooms/public/' + roomId), {
            roomName: roomName,
            type: type, // public or private
        });
    } else if (type === "private") {
        set(ref(db, 'rooms/private/' + roomId), {
            roomName: roomName,
            password: password,
            type: type, // public or private
        });
    }
}

export function updateRooms(rooms) {
    const roomsList = document.getElementById("public-rooms-list");
    // Clear the list
    roomsList.innerHTML = "";

    // Add each room to the list
    for (const room in rooms) {
        const roomName = rooms[room].roomName;

        const roomItem = document.createElement("article");
        roomItem.classList.add("room-card");

        const roomNameElement = document.createElement("h3");
        roomNameElement.textContent = roomName;

        roomItem.appendChild(roomNameElement);

        roomsList.appendChild(roomItem);
    }
}

// Add an event listener to the rooms list in the database
const roomsRef = ref(db, 'rooms/public');
onValue(roomsRef, (snapshot) => {
    const data = snapshot.val();
    updateRooms(data);
});