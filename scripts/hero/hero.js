import { setInitialDeck, animationLoop } from './shuffle.js';

// Start the animation loop
export function startShuffle() {
    setInitialDeck();

    setTimeout(() => {
        animationLoop();
    }, 1000);
}

