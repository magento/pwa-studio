import { useCallback, useMemo, useReducer } from 'react';

// TODO: port from venia
const getFilterParams = () => ({});

const init = shouldClear => {
    const filters = shouldClear ? {} : getFilterParams();

    return { filters };
};

const reducer = (state, { payload, type }) => {
    switch (type) {
        case 'apply filters': {
            return init();
        }
        case 'clear filters': {
            return init(true);
        }
        case 'update filter': {
            const { filters } = state;
            const { group, newState } = payload;

            if (!newState.length && group) {
                const nextFilters = { ...filters };

                delete nextFilters[group];

                return {
                    ...state,
                    filters: nextFilters
                };
            }

            return {
                ...state,
                filters: {
                    ...filters,
                    [group]: newState
                }
            };
        }
        default: {
            return state;
        }
    }
};

export const useUserState = () => {
    const [state, dispatch] = useReducer(reducer, false, init);

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
