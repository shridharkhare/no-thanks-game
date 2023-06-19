// Function that is used to start the animation loop for deck shuffling

// Create a deck array with strings from 3 to 35
let deck = [];

for (let i = 3; i <= 35; i++) {
    deck.push(i.toString());
}

function randomizeDeck() {
    for (let i = 0; i < deck.length; i++) {
        const randomIndex = Math.floor(Math.random() * deck.length);
        const temp = deck[i];
        deck[i] = deck[randomIndex];
        deck[randomIndex] = temp;
    }
}

function setInitialDeck() {
    randomizeDeck();
    const shufflingDeck = document.querySelector('.shuffling-deck');

    for (let i = 0; i < deck.length; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = deck[i];
        shufflingDeck.appendChild(card);
    }
}

function shuffle() {
}

export default function startShuffle() {

}

