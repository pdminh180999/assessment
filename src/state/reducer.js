export const initialState = {
    stacks: [],
    loading: true,
    error: null
};

export const ACTIONS = {
    SET_STACKS: 'SET_STACKS',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    ADD_STACK: 'ADD_STACK',
    UPDATE_STACK: 'UPDATE_STACK',
    DELETE_STACK: 'DELETE_STACK',
    ADD_CARD: 'ADD_CARD',
    UPDATE_CARD: 'UPDATE_CARD',
    DELETE_CARD: 'DELETE_CARD',
    MOVE_CARD: 'MOVE_CARD',
};

export function wishlistReducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_STACKS:
            return {
                ...state,
                stacks: action.payload,
                loading: false,
                error: null
            };

        case ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            };

        case ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            };

        case ACTIONS.ADD_STACK:
            return {
                ...state,
                stacks: [...state.stacks, action.payload]
            };

        case ACTIONS.UPDATE_STACK:
            return {
                ...state,
                stacks: state.stacks.map(s =>
                    s.id === action.payload.id ? action.payload : s
                )
            };

        case ACTIONS.DELETE_STACK:
            return {
                ...state,
                stacks: state.stacks.filter(s => s.id !== action.payload)
            };

        case ACTIONS.ADD_CARD:
            return {
                ...state,
                stacks: state.stacks.map(s =>
                    s.id === action.payload.stackId
                        ? { ...s, cards: [...s.cards, action.payload.card] }
                        : s
                )
            };

        case ACTIONS.UPDATE_CARD:
            return {
                ...state,
                stacks: state.stacks.map(s =>
                    s.id === action.payload.stackId
                        ? {
                            ...s,
                            cards: s.cards.map(c =>
                                c.id === action.payload.cardId ? action.payload.card : c
                            )
                        }
                        : s
                )
            };

        case ACTIONS.DELETE_CARD:
            return {
                ...state,
                stacks: state.stacks.map(s =>
                    s.id === action.payload.stackId
                        ? { ...s, cards: s.cards.filter(c => c.id !== action.payload.cardId) }
                        : s
                )
            };

        case ACTIONS.MOVE_CARD:
            return {
                ...state,
                stacks: state.stacks.map(s => {
                    if (s.id === action.payload.fromStackId) {
                        return {
                            ...s,
                            cards: s.cards.filter(c => c.id !== action.payload.cardId)
                        };
                    }
                    if (s.id === action.payload.toStackId) {
                        const card = state.stacks
                            .find(st => st.id === action.payload.fromStackId)
                            ?.cards.find(c => c.id === action.payload.cardId);
                        return card ? { ...s, cards: [...s.cards, card] } : s;
                    }
                    return s;
                })
            };

        default:
            return state;
    }
}
