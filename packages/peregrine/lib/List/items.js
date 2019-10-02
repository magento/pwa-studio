import React, { Fragment, useMemo } from 'react';
import { array, func, object, oneOf, oneOfType, string } from 'prop-types';

import iterable from '../validators/iterable';
import Item from './item';
import { useListState } from './useListState';

/**
 * The **Items** component is a container holding all the items
 *
 * @typedef Items
 * @kind functional component
 *
 * @param {props} props
 *
 * @returns{React.Element} A React component container for all the items in list.
 */
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

/**
 * props for {@link Items}
 *
 * @typedef props
 *
 * @property {func} getItemKey item key value getter
 * @property {array | object} initialSelection A single or list of objects that should start off selected
 * @property {iterable} items An iterable that yields `[key, item]` pairs such as an ES2015 Map
 * @property {func} onSelectionChange A callback that fires when the selection state changes
 * @property {func | string} renderItem A render prop for the list item elements. A tagname string, such as `"div"`, is also valid
 * @property {checkbox | radio} selectionModel A string corresponding to a selection model
 */
Items.propTypes = {
    getItemKey: func.isRequired,
    initialSelection: oneOfType([array, object]),
    items: iterable.isRequired,
    onSelectionChange: func,
    renderItem: oneOfType([func, string]),
    selectionModel: oneOf(['checkbox', 'radio'])
};

/**
 * default props for {@link Items}
 *
 * @typedef @defaultProps
 */
Items.defaultProps = {
    getItemKey: ({ id }) => id,
    selectionModel: 'radio'
};

export default Items;
