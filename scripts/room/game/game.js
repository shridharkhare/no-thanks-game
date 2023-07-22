import { db } from '../../utils/firebase.js';
import { get, set, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { createCardElement } from './elements.js';

const pos = {
    0: 'bp', 1: 'lp', 2: 'tp', 3: 'rp'
};

export class Game {
    constructor() {
        this.roomId;
        this.type;
        this.players = [];
        this.deck = [];
        this.topCard = 0;
        this.currentPlayer = '';
        this.currentBid = 0;
        this.gameOver = false;
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
                name: members[member].name,
                cards: [],
                chips: 11,
            });
        }
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
        console.log(game);

        this.players = game.players;
        const bpID = window.localStorage.getItem('noThanksGamePlayerId');
        // Circular shift the players so that the bottom player is the first player
        while (this.players[0].id !== bpID) {
            this.players.push(this.players.shift());
        }
        // Create a cards property for each player
        for (const player of this.players) {
            player.cards = [];
        }

        this.deck = game.deck;
        this.topCard = game.topCard;
        this.currentCard = game.currentCard;
        this.currentPlayer = game.currentPlayer;
        this.currentBid = game.currentBid;
        this.roomId = roomId;
        this.type = type;

        this.setGamePermanents();
        this.setGameGraphics();
    }

    async endGame() {
        // Update the game state in the database
        await set(ref(db, `rooms/${this.type}/${this.roomId}/game`), this);

        // End the game
        this.gameOver = true;

        // Calculate the scores. The scores are the number of cards the player has minus the number of chips they have.
        // Bonus: If a player has a sequence of cards, only the lowest card in the sequence counts towards their score.
        for (const player of this.players) {
            // Sort the cards
            player.cards.sort((a, b) => a - b);

            // Find the sequences
            const sequences = [];
            let sequence = [];
            for (let i = 0; i < player.cards.length; i++) {
                if (player.cards[i] + 1 === player.cards[i + 1]) {
                    sequence.push(player.cards[i]);
                } else {
                    sequence.push(player.cards[i]);
                    sequences.push(sequence);
                    sequence = [];
                }
            }

            // Find the lowest card in each sequence
            const lowestCards = [];
            for (const sequence of sequences) {
                lowestCards.push(sequence[0]);
            }

            // Calculate the score
            let score = player.cards.length - player.chips;
            for (const card of lowestCards) {
                score -= card;
            }

            // Update the player's score in the database
            await set(ref(db, `rooms/${this.type}/${this.roomId}/members/${player.id}/score`), score);
        }

        // Lowest score wins
        const snapshot = await get(ref(db, `rooms/${this.type}/${this.roomId}/members`));
        const members = snapshot.val();

        // Find the player with the lowest score
        let lowestScore = Infinity;
        let winnerId = '';
        for (const member in members) {
            if (members[member].score < lowestScore) {
                lowestScore = members[member].score;
                winnerId = member;
            }
        }

        console.log(winnerId);
    };

    setGamePermanents() {
        // Place the buttons to accept or pass the card
        const BPName = document.getElementById('bp-name');
        const TPName = document.getElementById('tp-name');
        const LPName = document.getElementById('lp-name');
        const RPName = document.getElementById('rp-name');

        // Put the names of the players.
        BPName.innerText = this.players[0].name;
        LPName.innerText = this.players[1].name;
        TPName.innerText = this.players[2].name;
        RPName.innerText = this.players[3].name;

        // Set the accept and pass buttons for the bottom player
        const acceptButton = document.getElementById('take-button');
        acceptButton.addEventListener('click', () => {
            this.acceptCard();
        });

        const passButton = document.getElementById('pass-button');
        passButton.addEventListener('click', () => {
            this.passCard();
        });
    }

    clearOldState() {
        // Remove the current turn class from the name
        const currentTurn = document.querySelector('.current-turn');
        if (currentTurn) {
            currentTurn.classList.remove('current-turn');
        }

        // Enable the accept and pass buttons
        const acceptButton = document.getElementById('take-button');
        const passButton = document.getElementById('pass-button');

        acceptButton.disabled = false;
        passButton.disabled = false;
    }

    setGameGraphics() {
        // Set the top card
        const deck = document.getElementById('deck');
        deck.innerHTML = '';
        const topCard = createCardElement(this.topCard);
        deck.appendChild(topCard);

        // Show who's turn it is by appending a class to the name
        for (const player of this.players) {
            if (player.id === this.currentPlayer) {
                // Find the index of the player
                const index = this.players.indexOf(player);

                const currentTurn = document.getElementById(`${pos[index]}-name`);
                currentTurn.classList.add('current-turn');
            }
        }

        // Disable the accept and pass buttons if it's not the bottom player's turn
        if (this.currentPlayer !== this.players[0].id) {
            const acceptButton = document.getElementById('take-button');
            const passButton = document.getElementById('pass-button');

            acceptButton.disabled = true;
            passButton.disabled = true;
        }
    }

    async acceptCard() {
        // Add the top card to the player's cards
        this.players.find(player => player.id === this.currentPlayer).cards.push(this.topCard);

        // If this.deck is empty, end the game
        if (this.deck.length === 0) {
            // Update the game state in the database
            await set(ref(db, `rooms/${this.type}/${this.roomId}/game`), this);

            // End the game
            this.endGame();
        } else {
            // Change the top card
            this.topCard = this.deck.pop();

            // Update the current player
            const index = this.players.indexOf(currentPlayer);
            this.currentPlayer = this.players[(index + 1) % 4].id;

            // Update the game state in the database
            await set(ref(db, `rooms/${this.type}/${this.roomId}/game`), this);
        }
    }
}
