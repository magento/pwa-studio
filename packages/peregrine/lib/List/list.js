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

List.propTypes = {
    /**
     * Class names to use when styling this component
     */
    classes: shape({
        root: string
    }),
    getItemKey: func.isRequired,
    /**
     * A single or list of initial selections.
     */
    initialSelection: oneOfType([array, object]),
    /**
     * An iterable that yields `[key, item]` pairs such as an ES2015 Map
     */
    items: iterable.isRequired,
    /**
     * A render prop for the list element. A tagname string, such as `"div"`, is also valid.
     */
    render: oneOfType([func, string]).isRequired,
    /**
     * A render prop for the list item elements. A tagname string, such as `"div"`, is also valid.
     */
    renderItem: oneOfType([func, string]),
    /**
     * A callback that fires when the selection state changes.
     */
    onSelectionChange: func,
    /**
     * A string corresponding to a selection model.
     */
    selectionModel: oneOf(['checkbox', 'radio'])
};

List.defaultProps = {
    classes: {},
    getItemKey: ({ id }) => id,
    items: [],
    render: 'div',
    renderItem: 'div',
    selectionModel: 'radio'
};

export default List;
