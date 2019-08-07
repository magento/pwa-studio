import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { array, func, object, oneOf, oneOfType, string } from 'prop-types';

import iterable from '../validators/iterable';
import Item from './item';

const Items = props => {
    const {
        getItemKey,
        initialSelection,
        items,
        onSelectionChange,
        renderItem,
        selectionModel
    } = props;

    const initialSelectedKeys = useMemo(() => {
        if (!initialSelection) {
            return null;
        }

        // We store the keys of each item that is initially selected.
        if (!Array.isArray(initialSelection)) {
            return [getItemKey(initialSelection)];
        } else {
            return initialSelection.map(getItemKey);
        }
    }, [getItemKey, initialSelection]);

    const [cursor, setCursor] = useState(null);
    const [hasFocus, setHasFocus] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState(
        new Set(initialSelectedKeys)
    );

    const handleFocus = useCallback(index => {
        setCursor(index);
        setHasFocus(true);
    }, []);

    const handleClick = useCallback(
        key => {
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

            // Set the new state.
            setSelectedKeys(newSelectedKeys);

            // And notify.
            if (onSelectionChange) {
                onSelectionChange(newSelectedKeys);
            }
        },
        [onSelectionChange, selectedKeys, selectionModel]
    );

    const children = useMemo(() => {
        return Array.from(items, (item, index) => {
            const key = getItemKey(item, index);

            return (
                <Item
                    hasFocus={hasFocus && cursor === key}
                    isSelected={selectedKeys.has(key)}
                    item={item}
                    itemIndex={index}
                    key={key}
                    onBlur={setHasFocus(false)}
                    onClick={handleClick.bind(this, key)}
                    onFocus={handleFocus}
                    render={renderItem}
                />
            );
        });
    }, [
        cursor,
        getItemKey,
        handleClick,
        handleFocus,
        hasFocus,
        items,
        renderItem,
        selectedKeys
    ]);

    return <Fragment>{children}</Fragment>;
};

Items.propTypes = {
    getItemKey: func.isRequired,
    initialSelection: oneOfType([array, object]),
    items: iterable.isRequired,
    onSelectionChange: func,
    renderItem: oneOfType([func, string]),
    selectionModel: oneOf(['checkbox', 'radio'])
};

Items.defaultProps = {
    getItemKey: ({ id }) => id,
    selectionModel: 'radio'
};

export default Items;
