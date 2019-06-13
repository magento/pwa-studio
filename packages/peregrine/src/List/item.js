import React from 'react';
import PropTypes from 'prop-types';

import fromRenderProp from '../util/fromRenderProp';

const isString = item => typeof item === 'string';

const getChild = item => (isString(item) ? item : null);

function Item(props) {
    const {
        classes,
        hasFocus,
        isSelected,
        item,
        itemIndex,
        render,
        ...restProps
    } = props;
    const customProps = { classes, hasFocus, isSelected, item, itemIndex };
    const Root = fromRenderProp(render, Object.keys(customProps));
    return (
        <Root className={classes.root} {...customProps} {...restProps}>
            {getChild(item)}
        </Root>
    );
}

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
