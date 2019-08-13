import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import fromRenderProp from '../util/fromRenderProp';

const isString = item => typeof item === 'string';

const getChild = item => (isString(item) ? item : null);

const Item = props => {
    const {
        uniqueID: key,
        classes,
        hasFocus,
        isSelected,
        item,
        itemIndex,
        render,
        updateSelection,
        setFocus,
        ...restProps
    } = props;
    const onClick = useCallback(() => updateSelection(key), [
        updateSelection,
        key
    ]);
    const onFocus = useCallback(() => setFocus(key), [setFocus, key]);
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
    render: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
    uniqueID: PropTypes.number
};

Item.defaultProps = {
    classes: {},
    hasFocus: false,
    isSelected: false,
    render: 'div'
};

export default Item;
