import React, { useMemo, useCallback } from 'react';
import {
    array,
    func,
    object,
    oneOf,
    oneOfType,
    shape,
    string
} from 'prop-types';

import fromRenderProp from '../util/fromRenderProp';
import iterable from '../validators/iterable';
import Items from './items';

/**
 * The **List** component maps a collection of data objects into an array of elements.
 * It also manages the selection and focus of those elements.
 *
 * @typedef List
 * @kind functional component
 *
 * @param {props} props React Component props
 *
 * @returns{React.Element} A React component that displays list data.
 */
const List = props => {
    const {
        classes,
        getItemKey,
        initialSelection,
        items,
        render,
        renderItem,
        onSelectionChange,
        selectionModel,
        ...restProps
    } = props;

    const customProps = {
        classes,
        getItemKey,
        items,
        onSelectionChange,
        selectionModel
    };

    const handleSelectionChange = useCallback(
        selection => {
            if (onSelectionChange) {
                onSelectionChange(selection);
            }
        },
        [onSelectionChange]
    );

    const Root = useMemo(
        () => fromRenderProp(render, Object.keys(customProps)),
        [render, customProps]
    );

    return (
        <Root className={classes.root} {...customProps} {...restProps}>
            <Items
                getItemKey={getItemKey}
                initialSelection={initialSelection}
                items={items}
                renderItem={renderItem}
                selectionModel={selectionModel}
                onSelectionChange={handleSelectionChange}
            />
        </Root>
    );
};

/**
 * props for {@link List}
 *
 * @typedef props
 *
 * @property {Object} classes css classes prop for List
 * @property {string} classes.root css classes for List root container
 * @property {func} getItemKey item key value getter
 * @property {array | object} initialSelection A single or list of objects that should start off selected
 * @property {iterable} items An iterable that yields `[key, item]` pairs such as an ES2015 Map
 * @property {func | string} render A render prop for the list element. A tagname string, such as `"div"`, is also valid.
 * @property {func | string} renderItem A render prop for the list item elements. A tagname string, such as `"div"`, is also valid
 * @property {func} onSelectionChange A callback that fires when the selection state changes
 * @property {checkbox | radio} selectionModel A string corresponding to a selection model
 */
List.propTypes = {
    classes: shape({
        root: string
    }),
    getItemKey: func.isRequired,
    initialSelection: oneOfType([array, object]),
    items: iterable.isRequired,
    render: oneOfType([func, string]).isRequired,
    renderItem: oneOfType([func, string]),
    onSelectionChange: func,
    selectionModel: oneOf(['checkbox', 'radio'])
};

/**
 * default props for {@link List}
 *
 * @typedef defaultProps
 */
List.defaultProps = {
    classes: {},
    getItemKey: ({ id }) => id,
    items: [],
    render: 'div',
    renderItem: 'div',
    selectionModel: 'radio'
};

export default List;
