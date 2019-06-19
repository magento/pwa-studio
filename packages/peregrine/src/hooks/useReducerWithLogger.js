import { useCallback, useMemo, useRef, useReducer } from 'react';
const enableLogger = process.env.NODE_ENV !== 'production';

/**
 * A custom wrapper around `useReducer` that adds logging in non-production envs
 */
export const useReducerWithLogger = (...args) => {
    const prevState = useRef();
    const [state, dispatch] = useReducer(...args);

    const dispatchWithLogging = useCallback(action => {
        prevState.current = { ...prevState.current, action };
        dispatch(action);
    }, []);

    useMemo(() => {
        if (!enableLogger || !prevState.current) return;
        const {
            action: { type, payload }
        } = prevState.current;
        console.groupCollapsed(type);
        console.group('payload');
        console.log(payload);
        console.groupEnd();
        console.group('next state');
        console.log(state);
        console.groupEnd();
        console.groupEnd();
    }, [state]);

    const customDispatch = enableLogger ? dispatchWithLogging : dispatch;
    prevState.current = { ...prevState.current, state };

    return [state, customDispatch];
};
