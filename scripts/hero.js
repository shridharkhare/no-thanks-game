const shufflingDeck = document.querySelector('.shuffling-deck');
const shufflingDeckRect = shufflingDeck.getBoundingClientRect();

const positions = [];
let deck = [];
for (let i = 3; i <= 35; i++) {
    deck.push(i.toString());
}

// Get all possible positions for the cards, if each row has 8 cards
// Card has     width: 35px height: 50px;
function regeneratePositions() {
    const paddingSpacing = 30;
    const innerSpacing = 20;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 4; j++) {
            const x = (i * innerSpacing) + (i * 35) + paddingSpacing;
            const y = (j * innerSpacing) + (j * 50) + paddingSpacing;
            positions.push({ x, y });
        }
    }

    const lastPositionX = (0 * innerSpacing) + (0 * 35) + paddingSpacing;
    const lastPositionY = (4 * innerSpacing) + (4 * 50) + paddingSpacing;

    positions.push({ x: lastPositionX, y: lastPositionY });
};

//Shuffling the array of cards
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
    shufflingDeck.innerHTML = '';
    for (let i = 0; i < deck.length; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = deck[i];
        shufflingDeck.appendChild(card);

        // Set the initial position of the card
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;

        const shufflingDeckCenterX = shufflingDeckRect.left + shufflingDeckRect.width / 2;
        const shufflingDeckCenterY = shufflingDeckRect.top + shufflingDeckRect.height / 2;

        const deltaX = shufflingDeckCenterX - cardCenterX;
        const deltaY = shufflingDeckCenterY - cardCenterY;

        card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

        // Save values to the card's attributes
        card.setAttribute('data-delta-x', deltaX);
        card.setAttribute('data-delta-y', deltaY);

        card.setAttribute('data-start-x', deltaX);
        card.setAttribute('data-start-y', deltaY);
    }
}

function moveCardWithAnimation(card, startX, startY, endX, endY) {
    // Set the initial position of the card
    card.style.transform = `translate(${startX}px, ${startY}px)`;

    // Save values to the card's attributes
    card.setAttribute('data-start-x', endX);
    card.setAttribute('data-start-y', endY);

    // Move the card to the end position with animation
    setTimeout(() => {
        card.style.transition = 'transform 1s';
        card.style.transform = `translate(${endX}px, ${endY}px)`;
    }, 1000);
}

function scatterCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const deltaX = card.getAttribute('data-start-x');
        const deltaY = card.getAttribute('data-start-y');

        // Get a random position
        const randomIndex = Math.floor(Math.random() * positions.length);
        const randomPosition = positions[randomIndex];
        // Remove the position from the array
        positions.splice(randomIndex, 1);
        const endX = randomPosition.x;
        const endY = randomPosition.y;

        moveCardWithAnimation(card, deltaX, deltaY, endX, endY);
    });
}

function gatherCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const startX = card.getAttribute('data-start-x');
        const startY = card.getAttribute('data-start-y');

        const deltaX = card.getAttribute('data-delta-x');
        const deltaY = card.getAttribute('data-delta-y');

        moveCardWithAnimation(card, startX, startY, deltaX, deltaY);
    });
}

function animationLoop() {
    regeneratePositions();
    scatterCards();

    // // Wait for 1 second
    setTimeout(() => {
        gatherCards();
    }, 2000);

    // // Wait for 2 seconds
    setTimeout(() => {
        animationLoop();
    }, 4000);
}

// Start the animation loop
export function startShuffle() {
    setInitialDeck();
    setTimeout(() => {
        animationLoop();
    }, 1000);
}

