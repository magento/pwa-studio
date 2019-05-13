import { useReducer } from 'react';
const initialState = {};

const reducer = (prevState = initialState, action = {}) => {
    const { type, payload } = action;

    console.log(type, payload);
    switch (type) {
        case 'add':
            // If we are adding a toast that already exists we need to clear the
            // old removal timeout effectively resetting the delete timer.
            if (prevState[payload.id]) {
                window.clearTimeout(prevState[payload.id].removalTimeoutId);
            }

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

            // Clear the old toast removal timeout incase an identical toast is
            // added after this.
            window.clearTimeout(newState[payload.id].removalTimeoutId);

            // Delete the toast from the store.
            delete newState[payload.id];

            return newState;
        default:
            return prevState;
    }
};

export const useToastState = () => {
    return useReducer(reducer, initialState);
};
