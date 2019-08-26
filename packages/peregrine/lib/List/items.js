import React, { Fragment, useMemo } from 'react';
import { array, func, object, oneOf, oneOfType, string } from 'prop-types';

import iterable from '../validators/iterable';
import Item from './item';
import { useListState } from './useListState';

const Items = props => {
    const {
        getItemKey,
        initialSelection,
        items,
        onSelectionChange,
        renderItem,
        selectionModel
    } = props;

    const [state, api] = useListState({
        getItemKey,
        initialSelection,
        onSelectionChange,
        selectionModel
    });
    const { cursor, hasFocus, selectedKeys } = state;
    const { removeFocus, setFocus, updateSelectedKeys } = api;

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
                    onBlur={removeFocus}
                    render={renderItem}
                    setFocus={setFocus}
                    uniqueId={key}
                    updateSelectedKeys={updateSelectedKeys}
                />
            );
        });
    }, [
        cursor,
        getItemKey,
        hasFocus,
        items,
        removeFocus,
        renderItem,
        selectedKeys,
        setFocus,
        updateSelectedKeys
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
