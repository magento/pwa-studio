import { useReducer } from 'react';
const initialState = {};

const reducer = (prevState = initialState, action = {}) => {
    const { type, payload } = action;
    console.log(type, payload);
    switch (type) {
        case 'add':
            return {
                ...prevState,
                [payload.id]: {
                    id: payload.id,
                    type: payload.type,
                    icon: payload.icon,
                    message: payload.message,
                    actionText: payload.actionText,
                    actionCallback: payload.actionCallback,
                    dismissable: payload.dismissable
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
