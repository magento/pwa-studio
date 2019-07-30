import { useCallback, useMemo, useReducer } from 'react';
import withLogger from '../../util/withLogger';
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

const wrappedReducer = withLogger(reducer);
export const useUserState = () => {
    const [state, dispatch] = useReducer(wrappedReducer, initialState);

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
            dispatch,
            reset,
            setUser
        }),
        [reset, setUser]
    );

    return [state, api];
};
