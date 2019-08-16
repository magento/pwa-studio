import { useCallback, useMemo, useReducer } from 'react';
import withLogger from '../../util/withLogger';

const initialState = {};

const reducer = (state, { payload, type }) => {
    switch (type) {
        case 'set countries': {
            return {
                ...state,
                countries: payload
            };
        }
        default: {
            return state;
        }
    }
};

const wrappedReducer = withLogger(reducer);
export const useDirectoryState = () => {
    const [state, dispatch] = useReducer(wrappedReducer, initialState);

    const setCountries = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'set countries'
            });
        },
        [dispatch]
    );

    const api = useMemo(
        () => ({
            setCountries
        }),
        [setCountries]
    );

    return [state, api];
};
