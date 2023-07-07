// Game state for No thanks game
let game = {
    players: [],
    deck: [],
    board: [],
    currentCard: 0,
    currentPlayer: '',
    currentBid: 0,
};

// Function to initialize deck
const initializeDeck = () => {
    for (let i = 3; i <= 35; i++) {
        game.deck.push(i);
    }

    // Remove 9 random cards from the deck
    for (let i = 0; i < 9; i++) {
        const randomIndex = Math.floor(Math.random() * game.deck.length);
        game.deck.splice(randomIndex, 1);
    }

    // Shuffle the deck
    game.deck.sort(() => Math.random() - 0.5);
};

// Function to initialize board
const initializeBoard = () => {
    // Add the first card to the board
    game.board.push(game.deck.pop());
};

// Function to initialize players
const initializePlayers = () => {
    // Add players to the game
    for (let i = 0; i < game.players.length; i++) {
        game.players[i].cards = [];
        game.players[i].score = 0;
    }
};

export const startGame = async (roomId) => {

    // Expand the game area to 100vh
    const gameCanvas = document.getElementById("game-canvas");
    gameCanvas.classList.remove("hidden");

    // Initialize the deck
    initializeDeck();

    // Initialize the board
    initializeBoard();
};