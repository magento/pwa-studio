import React, { Fragment, useReducer, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import iterable from '../validators/iterable';
import ListItem from './item';
import Item from './item';

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

const reducer = (state, action) => {
    switch (action.type) {
        case 'REMOVE_FOCUS':
            return {
                ...state,
                hasFocus: false
            };
        case 'SET_FOCUS':
            return {
                ...state,
                hasFocus: true,
                cursor: action.key
            };
        case 'UPDATE_SELECTION': {
            const { key, selectionModel } = action;
            return {
                ...state,
                selection: updateSelection(key, state.selection, selectionModel)
            };
        }
        default:
            return state;
    }
};

const initialState = {
    cursor: null,
    hasFocus: false,
    selection: new Set()
};

function Items(props) {
    const {
        getItemKey,
        items,
        renderItem,
        selectionModel,
        onSelectionChange
    } = props;
    const [{ cursor, hasFocus, selection }, dispatch] = useReducer(
        reducer,
        initialState
    );
    useEffect(() => {
        onSelectionChange && onSelectionChange(selection);
    }, [Array.from(selection).toString()]); // when ever the selection changes, make the call
    const removeFocus = useCallback(
        () => dispatch({ type: 'REMOVE_FOCUS' }),
        []
    );
    const updateSelection = useCallback(
        key =>
            dispatch({
                type: 'UPDATE_SELECTION',
                key,
                selectionModel
            }),
        []
    );
    const setFocus = useCallback(
        key => dispatch({ type: 'SET_FOCUS', key }),
        []
    );
    const children = items.map((item, index) => {
        const key = getItemKey(item, index);
        return (
            <ListItem
                key={key}
                item={item}
                itemIndex={index}
                render={renderItem}
                hasFocus={hasFocus && cursor === key}
                isSelected={selection.has(key)}
                onBlur={removeFocus}
                onClick={updateSelection(key)}
                onFocus={setFocus(key)}
            />
        );
    });
    return <Fragment>{children}</Fragment>;
}

Item.propTypes = {
    getItemKey: PropTypes.func.isRequired,
    items: iterable.isRequired,
    renderItem: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    selectionModel: PropTypes.oneOf(['checkbox', 'radio'])
};

Items.defaultProps = {
    getItemKey: ({ id }) => id,
    selectionModel: 'radio'
};

export default Items;
