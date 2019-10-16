import { useMemo, useReducer, useCallback, useEffect } from 'react';

import withLogger from '../util/withLogger';

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that contains
 * logic for handling a list of items.
 *
 * It returns the state of the list and an API object for managing the items in the list.
 *
 * @typedef {function} useListState
 *
 * @param {Object} config - an object containing:
 * @param {Func}    getItemKey - A function to get an Item's key.
 * @param {Array}   initialSelection - An array of keys that should be selected.
 * @param {string}  selectionModel - The list's selection type (radio or checkbox).
 * @param {function(Set):void} onSelectionChange - function to be called when the List selection changes.
 *
 * @return {Object[]} An array with two entries containing the following content: [ {@link ListState}, {@link API}]
 */
export const useListState = ({
    getItemKey,
    initialSelection,
    onSelectionChange,
    selectionModel
}) => {
    const initialState = useMemo(
        () => getInitialState({ getItemKey, initialSelection, selectionModel }),
        [getItemKey, initialSelection, selectionModel]
    );

    const [state, dispatch] = useReducer(wrappedReducer, initialState);
    const { selectedKeys } = state;

    // Whenever the selectedKeys changes, notify.
    useEffect(() => {
        if (onSelectionChange) {
            onSelectionChange(selectedKeys);
        }
    }, [onSelectionChange, selectedKeys]);

    /*
     *  Functions of the API.
     */

    /**
     * Function to remove focus on any item if it has focus.
     *
     * @typedef {function} removeFocus
     *
     * @param {void}
     * @returns {void}
     */
    const removeFocus = useCallback(
        () => dispatch({ type: 'REMOVE_FOCUS' }),
        []
    );

    /**
     * Function to set focus on a given item in the list.
     *
     * @typedef {function} setFocus
     *
     * @param {Key} key - Key of the item to set focus on.
     * @returns {void}
     */
    const setFocus = useCallback(
        key => dispatch({ type: 'SET_FOCUS', payload: { key } }),
        []
    );

    /**
     * Function to update the selected keys.
     *
     * @typedef {function} updateSelectedKeys
     *
     * @param {Key} key - The key of the item in the list to select (or deselect).
     * @returns {void}
     */
    const updateSelectedKeys = useCallback(
        key =>
            dispatch({
                type: 'UPDATE_SELECTED_KEYS',
                payload: { key, selectionModel }
            }),
        [selectionModel]
    );

    /**
     * The API for managing the Items inside the List.
     *
     * This object should never change.
     * @typedef {Object} API
     *
     * @property {setFocus} setFocus
     * @property {removeFocus} removeFocus
     * @property {updateSelectedKeys} updateSelectedKeys
     */

    const api = useMemo(
        () => ({
            setFocus,
            removeFocus,
            updateSelectedKeys
        }),
        [setFocus, removeFocus, updateSelectedKeys]
    );

    return [state, api];
};

/**
 * Reducer function that is used by the useReducer hook inside the useListState hook.
 *
 * @function reducer
 *
 * @param {ListState} state
 * @param {Object} action - object that contains:
 * @param {string} action.type
 * @param {Object} action.payload - object that contains:
 * @param {Key} action.payload.key
 * @param {string} action.payload.selectionModel
 */
const reducer = (state, { type, payload }) => {
    const { selectedKeys } = state;

    switch (type) {
        case 'REMOVE_FOCUS':
            return {
                ...state,
                hasFocus: false
            };
        case 'SET_FOCUS':
            return {
                ...state,
                hasFocus: true,
                cursor: payload.key
            };
        case 'UPDATE_SELECTED_KEYS': {
            const { key, selectionModel } = payload;
            const newSelectedKeys = updateSelectedKeysInternal(
                key,
                selectedKeys,
                selectionModel
            );

            return {
                ...state,
                selectedKeys: newSelectedKeys
            };
        }
        default:
            return state;
    }
};

const wrappedReducer = withLogger(reducer);

/**
 * Helper function to update the List's Set of selected keys.
 *
 * @function getInitialState
 *
 * @param {Object}  options - an object containing:
 * @param {Func}    getItemKey - Get an item's key.
 * @param {Array}   initialSelection - An array of keys that should be selected initially.
 * @param {string}  selectionModel
 *
 * @returns {Object} - {@link ListState}
 */
const getInitialState = ({ getItemKey, initialSelection, selectionModel }) => {
    const initiallySelectedKeys = getInitiallySelectedKeys({
        getItemKey,
        initialSelection,
        selectionModel
    });

    return {
        cursor: null,
        hasFocus: false,
        selectedKeys: new Set(initiallySelectedKeys)
    };
};

/**
 * Helper function to validate and set the initial list of selected keys.
 *
 * @param {Object}  options - an object containing:
 * @param {Func}    getItemKey - Get an item's key.
 * @param {Array}   initialSelection - An array of keys that should be selected initially.
 * @param {string}  selectionModel
 * @returns {Array} an array containing initial item keys
 */
const getInitiallySelectedKeys = ({
    getItemKey,
    initialSelection,
    selectionModel
}) => {
    if (!initialSelection) {
        return null;
    }

    // We store the keys of each item that is initially selected,
    // but we must also respect the selection model.
    if (selectionModel === 'radio') {
        // Only one thing can be selected at a time.
        const target = Array.isArray(initialSelection)
            ? initialSelection[0]
            : initialSelection;

        const itemKey = getItemKey(target);

        if (itemKey) {
            return [itemKey];
        }

        return [];
    }

    if (selectionModel === 'checkbox') {
        // Multiple things can be selected at a time.

        // Do we have multiple things?
        if (Array.isArray(initialSelection)) {
            return initialSelection.map(getItemKey);
        }

        const itemKey = getItemKey(initialSelection);

        if (itemKey) {
            return [itemKey];
        }

        return [];
    }
};

/**
 * Helper function to update the List's Set of selected keys.
 *
 * @function updateSelectedKeysInternal
 *
 * @param {Key} key - The key to update (add to or remove from) the Set.
 * @param {Set} selectedKeys - The keys that are currently in the Set.
 * @param {Set} selectionModel - One of "radio" or "checkbox".
 *  Informs whether multiple keys can be selected at the same time.
 *
 * @returns {Set} - The new Set of selectedKeys.
 */
const updateSelectedKeysInternal = (key, selectedKeys, selectionModel) => {
    let newSelectedKeys;

    if (selectionModel === 'radio') {
        // For radio, only one item can be selected at a time.
        newSelectedKeys = new Set().add(key);
    }

    if (selectionModel === 'checkbox') {
        newSelectedKeys = new Set(selectedKeys);

        if (!newSelectedKeys.has(key)) {
            // The item is being selected.
            newSelectedKeys.add(key);
        } else {
            // The item is being deselected.
            newSelectedKeys.delete(key);
        }
    }

    return newSelectedKeys;
};

// Custom Type Definitions

/**
 * Item's key type.
 *
 * @typedef {(string|number)} Key
 */

/**
 * The current state of the List.
 *
 * @typedef {Object} ListState
 *
 * @property {Key} cursor
 * @property {boolean} hasFocus
 * @property {Set} selectedKeys
 */
