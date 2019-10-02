import React, { useCallback, useMemo } from 'react';
import { any, bool, func, number, oneOfType, shape, string } from 'prop-types';

import fromRenderProp from '../util/fromRenderProp';

/**
 * The **Item** Component is reponsible for rendering each item in list
 *
 * @typedef Item
 * @kind functional component
 *
 * @param {props} props
 *
 * @returns{React.Element} A React component for rendering each item in list.
 */
const Item = props => {
    const {
        classes,
        hasFocus,
        isSelected,
        item,
        itemIndex,
        render,
        setFocus,
        uniqueId: key,
        updateSelectedKeys,
        ...restProps
    } = props;

    const children = typeof item === 'string' ? item : null;

    const onClick = useCallback(() => updateSelectedKeys(key), [
        key,
        updateSelectedKeys
    ]);
    const onFocus = useCallback(() => setFocus(key), [key, setFocus]);

    const customProps = {
        classes,
        hasFocus,
        isSelected,
        item,
        itemIndex,
        onClick,
        onFocus
    };

    const Root = useMemo(
        () => fromRenderProp(render, Object.keys(customProps)),
        [render, customProps]
    );

    return (
        <Root className={classes.root} {...customProps} {...restProps}>
            {children}
        </Root>
    );
};

/**
 * props for {@link Item}
 *
 * @typedef props
 *
 * @property {Object} classes css classes prop for Item
 * @property {string} classes.root css classes for Item root container
 * @property {bool} hasFocus Does the item have focus
 * @property {bool} isSelected Is the item currently selected
 * @property {any} item item data
 * @property {number} itemIndex index of item
 * @property {func | string} render A render prop for the list item. A tagname string, such as `"div"`, is also valid
 * @property {func} setFocus A callback for setting focus
 * @property {number | string} uniqueId unique Id given for the item
 * @property {func} updateSelectedKeys A callback for updating selected items
 */
Item.propTypes = {
    classes: shape({
        root: string
    }),
    hasFocus: bool,
    isSelected: bool,
    item: any.isRequired,
    itemIndex: number.isRequired,
    render: oneOfType([func, string]).isRequired,
    setFocus: func,
    uniqueId: oneOfType([number, string]).isRequired,
    updateSelectedKeys: func.isRequired
};

/**
 * default props for {@link Item}
 *
 * @typedef @defaultProps
 */
Item.defaultProps = {
    classes: {},
    hasFocus: false,
    isSelected: false,
    render: 'div'
};

export default Item;
