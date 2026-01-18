import {generateId} from "../utils/helpers.js";

const STORAGE_KEY = 'wishlist_stacks';
const NETWORK_DELAY = 300;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredStacks = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return [];
    }
};

const saveStacks = (stacks) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stacks));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

export const mockAPI = {
    async getStacks() {
        await delay(NETWORK_DELAY);
        return getStoredStacks();
    },

    async createStack(stack) {
        await delay(NETWORK_DELAY);
        const stacks = getStoredStacks();
        const newStack = {
            ...stack,
            id: generateId(),
            cards: [],
            createdAt: new Date().toISOString()
        };
        stacks.push(newStack);
        saveStacks(stacks);
        return newStack;
    },

    async updateStack(stackId, updates) {
        await delay(NETWORK_DELAY);
        const stacks = getStoredStacks();
        const stack = stacks.find(s => s.id === stackId);

        if (!stack) {
            throw new Error('Stack not found');
        }

        Object.assign(stack, updates);
        saveStacks(stacks);
        return stack;
    },

    async deleteStack(stackId) {
        await delay(NETWORK_DELAY);
        const stacks = getStoredStacks();
        const filtered = stacks.filter(s => s.id !== stackId);
        saveStacks(filtered);
        return { success: true, stackId };
    },

    async addCard(stackId, card) {
        await delay(NETWORK_DELAY);
        const stacks = getStoredStacks();
        const stack = stacks.find(s => s.id === stackId);

        if (!stack) {
            throw new Error('Stack not found');
        }

        const newCard = {
            ...card,
            id: generateId(),
            createdAt: new Date().toISOString()
        };

        stack.cards.push(newCard);
        saveStacks(stacks);
        return newCard;
    },

    async updateCard(stackId, cardId, updates) {
        await delay(NETWORK_DELAY);
        const stacks = getStoredStacks();
        const stack = stacks.find(s => s.id === stackId);

        if (!stack) {
            throw new Error('Stack not found');
        }

        const card = stack.cards.find(c => c.id === cardId);
        if (!card) {
            throw new Error('Card not found');
        }

        Object.assign(card, updates);
        saveStacks(stacks);
        return card;
    },

    async deleteCard(stackId, cardId) {
        await delay(NETWORK_DELAY);
        const stacks = getStoredStacks();
        const stack = stacks.find(s => s.id === stackId);

        if (!stack) {
            throw new Error('Stack not found');
        }

        stack.cards = stack.cards.filter(c => c.id !== cardId);
        saveStacks(stacks);
        return { success: true, cardId };
    },

    async moveCard(fromStackId, toStackId, cardId) {
        await delay(NETWORK_DELAY);
        const stacks = getStoredStacks();
        const fromStack = stacks.find(s => s.id === fromStackId);
        const toStack = stacks.find(s => s.id === toStackId);

        if (!fromStack || !toStack) {
            throw new Error('Stack not found');
        }

        const cardIndex = fromStack.cards.findIndex(c => c.id === cardId);
        if (cardIndex === -1) {
            throw new Error('Card not found');
        }

        const [card] = fromStack.cards.splice(cardIndex, 1);
        card.stackId = toStackId;
        toStack.cards.push(card);
        saveStacks(stacks);

        return { success: true, card };
    }
};
