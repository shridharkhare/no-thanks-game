import { createRoom } from "../lobby/rooms.js";

const createRoomForm = document.forms['create-room-form'];

createRoomForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Generate random ID
    const uuid = self.crypto.randomUUID();
    const roomName = createRoomForm.roomname.value;
    let password = null;
    let type = 'public';

    if (createRoomForm['private'].checked) {
        type = 'private';
        password = createRoomForm.password.value;
    }

    // Create room
    createRoom(uuid, roomName, password, type);

    // Redirect to room
    window.location.href = `/room.html?type=${type}&roomId=${uuid}`;

    // Clear form
    createRoomForm.reset();
});
