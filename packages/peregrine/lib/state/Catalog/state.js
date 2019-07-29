import { useCallback, useMemo, useReducer } from 'react';

const defaultRootCategoryId = 2;

const init = rootCategoryId => ({
    categories: {},
    rootCategoryId
});

const reducer = (state, { payload, type }) => {
    switch (type) {
        case 'set root category': {
            return {
                ...state,
                rootCategoryId: payload
            };
        }
        case 'update categories': {
            // TODO: implement
            return state;
        }
        default: {
            return state;
        }
    }
};

export const useCatalogState = () => {
    const [state, dispatch] = useReducer(reducer, defaultRootCategoryId, init);

    const setRootCategory = useCallback(
        payload => {
            dispatch({
                payload,
                type: 'set root category'
            });
        },
        [dispatch]
    );

    const updateCategories = useCallback(
        payload => {
            // TODO: implement
            dispatch({
                payload,
                type: 'update categories'
            });
        },
        [dispatch]
    );

    const api = useMemo(
        () => ({
            dispatch,
            setRootCategory,
            updateCategories
        }),
        [dispatch, setRootCategory, updateCategories]
    );

    return [state, api];
};
