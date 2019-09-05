import React, { useCallback, useMemo } from 'react';
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

Item.defaultProps = {
    classes: {},
    hasFocus: false,
    isSelected: false,
    render: 'div'
};

export default Item;
