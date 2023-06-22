import { writeRoomData } from "../lobby/rooms.js";

const createRoomForm = document.forms['create-room-form'];

createRoomForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const roomName = createRoomForm.roomname.value;
    let password = null;

    if (createRoomForm['private'].checked) {
        password = createRoomForm.password.value;
    }

    console.log(`Room name: ${roomName}`);
    console.log(`Password: ${password}`);

    let uuid = self.crypto.randomUUID();

    writeRoomData(uuid, roomName, password);

});
