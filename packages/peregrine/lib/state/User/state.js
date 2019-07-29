import { useCallback, useMemo, useReducer } from 'react';

import { BrowserPersistence } from '../../util';

const storage = new BrowserPersistence();
const isSignedIn = () => !!storage.getItem('signin_token');

const initialState = {
    currentUser: {
        email: '',
        firstname: '',
        lastname: ''
    },
    isSignedIn: isSignedIn()
};

const reducer = (state, { payload, type }) => {
    switch (type) {
        case 'set user': {
            return { ...state, currentUser: payload };
        }
        case 'reset': {
            return { ...initialState, isSignedIn: isSignedIn() };
        }
        default: {
            return state;
        }
    }
};

export const useUserState = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const setUser = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'set user'
            });
        },
        [dispatch]
    );

    const reset = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'reset'
            });
        },
        [dispatch]
    );

    const api = useMemo(
        () => ({
            reset,
            setUser
        }),
        [reset, setUser]
    );

    return [state, api];
};
