import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import fromRenderProp from '../util/fromRenderProp';

const isString = item => typeof item === 'string';

const getChild = item => (isString(item) ? item : null);

const Item = props => {
    const {
        key,
        classes,
        hasFocus,
        isSelected,
        item,
        itemIndex,
        render,
        updateSelection: _updateSelection,
        setFocus: _setFocus,
        ...restProps
    } = props;
    const updateSelection = useCallback(() => _updateSelection(key), [
        _updateSelection,
        key
    ]);
    const setFocus = useCallback(() => _setFocus(key), [_setFocus, key]);
    const customProps = {
        classes,
        hasFocus,
        isSelected,
        item,
        itemIndex,
        updateSelection,
        setFocus
    };
    const Root = fromRenderProp(render, Object.keys(customProps));
    return (
        <Root className={classes.root} {...customProps} {...restProps}>
            {getChild(item)}
        </Root>
    );
};

Item.propTypes = {
    classes: PropTypes.shape({
        root: PropTypes.string
    }),
    hasFocus: PropTypes.bool,
    isSelected: PropTypes.bool,
    item: PropTypes.any.isRequired,
    itemIndex: PropTypes.number.isRequired,
    render: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired
};

Item.defaultProps = {
    classes: {},
    hasFocus: false,
    isSelected: false,
    render: 'div'
};

export default Item;
