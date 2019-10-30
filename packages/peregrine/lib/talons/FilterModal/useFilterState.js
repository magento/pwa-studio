import { useCallback, useMemo, useReducer } from 'react';

import withLogger from '../../util/withLogger';

const init = next => (next instanceof Map ? next : new Map());

const reducer = (state, action) => {
    const { payload, type } = action;

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

            // if removing an item leaves a group empty, delete that group
            if (nextSet.size) {
                nextState.set(group, nextSet);
            } else {
                nextState.delete(group);
            }

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

            // if removing an item leaves a group empty, delete that group
            if (nextSet.size) {
                nextState.set(group, nextSet);
            } else {
                nextState.delete(group);
            }

            return nextState;
        }
        case 'set items': {
            return init(payload);
        }
    }
};

const wrappedReducer = withLogger(reducer);

export const useFilterState = () => {
    const [state, dispatch] = useReducer(wrappedReducer, null, init);

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

    const setItems = useCallback(
        payload => {
            dispatch({ payload, type: 'set items' });
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
            setItems,
            toggleItem
        }),
        [addItem, clear, dispatch, removeItem, setItems, toggleItem]
    );

    return [state, api];
};
