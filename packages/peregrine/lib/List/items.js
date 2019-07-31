import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { useListState } from './useListState';
import iterable from '../validators/iterable';
import Item from './item';

const Items = props => {
    const {
        getItemKey,
        items,
        renderItem,
        selectionModel,
        onSelectionChange
    } = props;
    const [
        { cursor, hasFocus, selection },
        { setFocus, removeFocus, updateSelection }
    ] = useListState({ selectionModel, onSelectionChange });
    const itemsElements = items.map((item, index) => {
        const key = getItemKey(item, index);
        return (
            <Item
                key={key}
                uniqueID={key}
                item={item}
                itemIndex={index}
                render={renderItem}
                hasFocus={hasFocus && cursor === key}
                isSelected={selection.has(key)}
                updateSelection={updateSelection}
                setFocus={setFocus}
                onBlur={removeFocus}
            />
        );
    });
    return <Fragment>{itemsElements}</Fragment>;
};

Items.propTypes = {
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
