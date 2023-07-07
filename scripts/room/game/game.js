import { db } from '../../utils/firebase.js';
import { get, set, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

export class Game {
    constructor() {
        this.players = [];
        this.deck = [];
        this.topCard = 0;
        this.currentCard = 0;
        this.currentPlayer = '';
        this.currentBid = 0;
    }

    initializeDeck() {
        for (let i = 3; i <= 35; i++) {
            this.deck.push(i);
        }

        // Remove 9 random cards from the deck
        for (let i = 0; i < 9; i++) {
            const randomIndex = Math.floor(Math.random() * this.deck.length);
            this.deck.splice(randomIndex, 1);
        }

        // Shuffle the deck
        this.deck.sort(() => Math.random() - 0.5);
    }

    initializeBoard() {
        // Add the first card to the board
        this.topCard = this.deck.pop();
    }

    async initializePlayers(type, roomId) {
        // Add players to the game by getting the members from the database
        const snapshot = await get(ref(db, `rooms/${type}/${roomId}/members`));
        const members = snapshot.val();

        // Loop through the members and add them to the game
        for (const member in members) {
            this.players.push({
                id: member,
                cards: [],
                chips: 11,
            });
        }

        // Shuffle the players
        this.players.sort(() => Math.random() - 0.5);
    }

    async startGame(roomId, type) {
        // Initialize the deck
        this.initializeDeck();

        // Initialize the board
        this.initializeBoard();

        // Initialize the players
        await this.initializePlayers(type, roomId);

        // Set the current player
        this.currentPlayer = this.players[0].id;

        // Set the current bid
        this.currentBid = 0;

        // Update the game state in the database
        await set(ref(db, `rooms/${type}/${roomId}/game`), this);
    }

    async setGame(roomId, type, game) {
        this.game = game;
    }
}
