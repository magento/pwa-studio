import { useReducer } from 'react';
const initialState = {
    toasts: {}
};

const reducer = (prevState = initialState, action = {}) => {
    const { type, payload } = action;

    // console.log(type, payload);
    switch (type) {
        case 'add': {
            // If we are adding a toast that already exists we need to clear the
            // old removal timeout effectively resetting the delete timer.
            if (prevState.toasts[payload.id]) {
                window.clearTimeout(
                    prevState.toasts[payload.id].removalTimeoutId
                );
            }

            const duplicate = !!prevState.toasts[payload.id];

            // For duplicate toasts, do not update the timestamp to maintain
            // order of toast emission.
            const timestamp = duplicate
                ? prevState.toasts[payload.id].timestamp
                : payload.timestamp;

            // Use a random key to trigger a recreation of this component if it
            // is a duplicate so that we can re-trigger the blink animation.
            const key = duplicate ? Math.random() : payload.id;

            const newState = {
                ...prevState,
                toasts: {
                    ...prevState.toasts,
                    [payload.id]: {
                        ...payload,
                        timestamp,
                        duplicate,
                        key
                    }
                }
            };

            return newState;
        }
        case 'remove': {
            const newState = {
                ...prevState
            };

            // Clear the old toast removal timeout incase an identical toast is
            // added after this.
            window.clearTimeout(newState.toasts[payload.id].removalTimeoutId);

            // Delete the toast from the store.
            delete newState.toasts[payload.id];

            // Do not blink on removal.
            Object.keys(newState.toasts).forEach(key => {
                newState.toasts[key].duplicate = false;
            });

            return newState;
        }
        default:
            return prevState;
    }
};

export const useToastState = () => {
    return useReducer(reducer, initialState);
};
