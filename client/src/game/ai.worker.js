// Runs the AI search off the main thread so the board stays responsive while the computer thinks.
import { chooseTurn } from './ai.js';

self.onmessage = (event) => {
    const { id, state, level } = event.data;
    try {
        self.postMessage({ id, result: chooseTurn(state, level) });
    } catch (error) {
        self.postMessage({ id, error: error.message });
    }
};
