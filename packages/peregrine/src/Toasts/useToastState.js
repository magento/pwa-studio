import { useReducer } from 'react';
const initialState = {};

const reducer = (prevState = initialState, action = {}) => {
    const { type, payload } = action;
    // TODO: Remove
    console.log(type, payload);
    switch (type) {
        case 'add':
            return {
                ...prevState,
                [payload.id]: {
                    ...payload
                }
            };
        case 'remove':
            const newState = {
                ...prevState
            };
            delete newState[payload.id];
            return newState;
        default:
            return prevState;
    }
};

export const useToastState = () => {
    return useReducer(reducer, initialState);
};
