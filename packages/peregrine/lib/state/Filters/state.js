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

export const useFiltersState = () => {
    const [state, dispatch] = useReducer(reducer, false, init);

    const applyFilters = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'apply filters'
            });
        },
        [dispatch]
    );

    const clearFilters = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'clear filters'
            });
        },
        [dispatch]
    );

    const updateFilter = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'update filter'
            });
        },
        [dispatch]
    );

    const api = useMemo(
        () => ({
            applyFilters,
            clearFilters,
            dispatch,
            updateFilter
        }),
        [applyFilters, clearFilters, dispatch, updateFilter]
    );

    return [state, api];
};
