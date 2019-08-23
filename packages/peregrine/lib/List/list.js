import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

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
    const Root = useMemo(
        () => fromRenderProp(render, Object.keys(customProps)),
        [render, customProps]
    );
    const handleSelectionChange = useCallback(
        selection => {
            onSelectionChange && onSelectionChange(selection);
        },
        [onSelectionChange]
    );
    return (
        <Root className={classes.root} {...customProps} {...restProps}>
            <Items
                items={items}
                getItemKey={getItemKey}
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
    classes: PropTypes.shape({
        root: PropTypes.string
    }),
    getItemKey: PropTypes.func.isRequired,
    /**
     * An iterable that yields `[key, item]` pairs such as an ES2015 Map
     */
    items: iterable.isRequired,
    /**
     * A render prop for the list element. A tagname string, such as `"div"`, is also valid.
     */
    render: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
    /**
     * A render prop for the list item elements. A tagname string, such as `"div"`, is also valid.
     */
    renderItem: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    /**
     * A callback that fires when the selection state changes.
     */
    onSelectionChange: PropTypes.func,
    /**
     * A string corresponding to a selection model.
     */
    selectionModel: PropTypes.oneOf(['checkbox', 'radio'])
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
