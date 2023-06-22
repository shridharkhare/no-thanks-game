import { createRoom } from "../lobby/rooms.js";

const createRoomForm = document.forms['create-room-form'];

createRoomForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const roomName = createRoomForm.roomname.value;
    let password = null;
    let type = 'public';

    if (createRoomForm['private'].checked) {
        type = 'private';
        password = createRoomForm.password.value;
    }

    // Generate random ID
    let uuid = self.crypto.randomUUID();
    // Create room
    createRoom(uuid, roomName, password, type);

    // Redirect to room

    // Clear form
    createRoomForm.reset();
});
