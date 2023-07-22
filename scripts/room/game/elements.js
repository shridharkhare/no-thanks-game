// A js file to hold the custom element builders

// Create a card element
export function createCardElement(card) {
    // Create the card element
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');

    // Create the card number
    const cardNumber = document.createElement('div');
    cardNumber.classList.add('card-number');
    cardNumber.innerHTML = card;
    cardElement.appendChild(cardNumber);

    // Show card number in small at topleft and bottom right
    const cardTL = document.createElement('div');
    cardTL.classList.add('card-number-top-left');
    cardTL.innerHTML = card;
    cardElement.appendChild(cardTL);

    const cardBR = document.createElement('div');
    cardBR.classList.add('card-number-bottom-right');
    cardBR.innerHTML = card;
    cardElement.appendChild(cardBR);

    return cardElement;
}