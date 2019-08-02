import { useMemo, useReducer, useCallback, useEffect } from 'react';

import withLogger from '../util/withLogger';

/**
 * Helper function to update selection of given key in the items list.
 *
 * @function updateSelection
 *
 * @param {Key} key
 * @param {Set} prevSelection
 * @param {Set} selectionModel
 * @returns {Set}
 */
const updateSelection = (key, prevSelection, selectionModel) => {
    let selection;
    if (selectionModel === 'radio') {
        selection = new Set().add(key);
    }
    if (selectionModel === 'checkbox') {
        selection = new Set(prevSelection);
        if (selection.has(key)) {
            selection.delete(key);
        } else {
            selection.add(key);
        }
    }
    return selection;
};

/**
 * Reducer function that is used by the useReducer hook inside the useListState hook.
 *
 * @function reducer
 *
 * @param {ListState} state
 * @param {Object} action
 * @param {string} action.type
 * @param {Object} action.payload
 * @param {Key} action.payload.key
 * @param {string} action.payload.selectionModel
 */
const reducer = (state, { type, payload }) => {
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
        case 'UPDATE_SELECTION': {
            return {
                ...state,
                selection: updateSelection(
                    payload.key,
                    state.selection,
                    payload.selectionModel
                )
            };
        }
        default:
            return state;
    }
};

const wrappedReducer = withLogger(reducer);

const initialState = {
    cursor: null,
    hasFocus: false,
    selection: new Set()
};

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that contains
 * logic for handling a list of items.
 *
 * It returns the state of the list and an API object for managing the items in the list.
 *
 * @typedef {function} useListState
 *
 * @param {Object} config
 * @param {string} config.selectionModel - type of the items selection that needs to be implemented (radio or checkbox)
 * @param {function(Set):void} config.onSelectionChange - function to be called when a item in the list is clicked.
 * @return {Object[]} An array with two entries containing the following content: [ {@link ListState}, {@link API}]
 */
export const useListState = ({ selectionModel, onSelectionChange }) => {
    const [state, dispatch] = useReducer(wrappedReducer, initialState);
    // when ever the selection changes, make the call
    useEffect(() => {
        onSelectionChange && onSelectionChange(state.selection);
    }, [onSelectionChange, state.selection]);
    const removeFocus = useCallback(
        () => dispatch({ type: 'REMOVE_FOCUS' }),
        []
    );
    const updateSelection = useCallback(
        key =>
            dispatch({
                type: 'UPDATE_SELECTION',
                payload: { key, selectionModel }
            }),
        [selectionModel]
    );
    const setFocus = useCallback(
        key => dispatch({ type: 'SET_FOCUS', payload: { key } }),
        []
    );
    const api = useMemo(
        () => ({
            setFocus,
            removeFocus,
            updateSelection
        }),
        [setFocus, removeFocus, updateSelection]
    );
    return [state, api];
};

// Custom Type Definitions

/**
 * Item's key type.
 *
 * @typedef {(string|number)} Key
 */

/**
 * Function to set focus on a given item in the list.
 *
 * @typedef {function} SetFocus
 *
 * @param {Key} key - Key of the item to set focus on.
 * @returns {void}
 */

/**
 * Function to remove focus on any item if it has focus.
 *
 * @typedef {function} RemoveFocus
 *
 * @param {void}
 * @returns {void}
 */

/**
 * Function to update selection.
 *
 * @typedef {function} UpdateSelection
 *
 * @param {Key} key - The key of the item in the list to select.
 * @returns {void}
 */

/**
 * The API for managing the Items inside the List.
 *
 * This object should never change.
 * @typedef {Object} API
 *
 * @property {SetFocus} setFocus
 * @property {RemoveFocus} removeFocus
 * @property {UpdateSelection} updateSelection
 */

/**
 * The current state of List.
 *
 * @typedef {Object} ListState
 *
 * @property {Key} cursor
 * @property {boolean} hasFocus
 * @property {Set} selection
 */
