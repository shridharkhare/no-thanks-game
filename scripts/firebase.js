// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBAYaI69YYy2OQcXERCCkVryEXM7WCLVVs",
    authDomain: "no-thanks-1027d.firebaseapp.com",
    databaseURL: "https://no-thanks-1027d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "no-thanks-1027d",
    storageBucket: "no-thanks-1027d.appspot.com",
    messagingSenderId: "948135657960",
    appId: "1:948135657960:web:810a19b49149cb4f0fe45d",
    measurementId: "G-66GMLRXYBW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);


// Create a test room 
// Set the value of the room
export function writeRoomData(roomId, roomName, password) {
    set(ref(db, 'rooms/' + roomId), {
        roomName: roomName,
        password: password
    });
}

