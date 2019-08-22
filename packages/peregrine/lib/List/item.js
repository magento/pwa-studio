import React, { useMemo } from 'react';
import { any, bool, func, number, oneOfType, shape, string } from 'prop-types';

import fromRenderProp from '../util/fromRenderProp';

const Item = props => {
    const {
        classes,
        hasFocus,
        isSelected,
        item,
        itemIndex,
        render,
        ...restProps
    } = props;

    const children = typeof item === 'string' ? item : null;
    const customProps = { classes, hasFocus, isSelected, item, itemIndex };

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

Item.propTypes = {
    classes: shape({
        root: string
    }),
    hasFocus: bool,
    isSelected: bool,
    item: any.isRequired,
    itemIndex: number.isRequired,
    render: oneOfType([func, string]).isRequired
};

Item.defaultProps = {
    classes: {},
    hasFocus: false,
    isSelected: false,
    render: 'div'
};

export default Item;
