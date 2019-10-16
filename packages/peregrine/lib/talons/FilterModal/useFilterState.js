import { useCallback, useMemo, useReducer } from 'react';

const init = () => new Map();

const reducer = (state, action) => {
    const { payload, type } = action;
    console.log({ payload, type });

    switch (type) {
        case 'clear': {
            return init();
        }
        case 'add item': {
            const { group, item } = payload;
            const nextState = new Map(state);
            const nextSet = new Set(state.get(group));

            nextSet.add(item);
            nextState.set(group, nextSet);

            return nextState;
        }
        case 'remove item': {
            const { group, item } = payload;
            const nextState = new Map(state);
            const nextSet = new Set(state.get(group));

            nextSet.delete(item);
            nextState.set(group, nextSet);

            return nextState;
        }
        case 'toggle item': {
            const { group, item } = payload;
            const nextState = new Map(state);
            const nextSet = new Set(state.get(group));

            if (nextSet.has(item)) {
                nextSet.delete(item);
            } else {
                nextSet.add(item);
            }
            nextState.set(group, nextSet);

            return nextState;
        }
    }
};

export const useFilterState = () => {
    const [state, dispatch] = useReducer(reducer, null, init);

    const addItem = useCallback(
        payload => {
            dispatch({ payload, type: 'add item' });
        },
        [dispatch]
    );

    const clear = useCallback(
        payload => {
            dispatch({ payload, type: 'clear' });
        },
        [dispatch]
    );

    const removeItem = useCallback(
        payload => {
            dispatch({ payload, type: 'remove item' });
        },
        [dispatch]
    );

    const toggleItem = useCallback(
        payload => {
            dispatch({ payload, type: 'toggle item' });
        },
        [dispatch]
    );

    const api = useMemo(
        () => ({
            addItem,
            clear,
            dispatch,
            removeItem,
            toggleItem
        }),
        [addItem, clear, dispatch, removeItem, toggleItem]
    );

    return [state, api];
};
