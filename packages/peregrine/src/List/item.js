import React, { Component } from 'react';
import PropTypes from 'prop-types';

import fromRenderProp from '../util/fromRenderProp';

class Item extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        hasFocus: PropTypes.bool,
        isSelected: PropTypes.bool,
        item: PropTypes.any.isRequired,
        itemIndex: PropTypes.number.isRequired,
        render: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
            .isRequired
    };

    static defaultProps = {
        classes: {},
        hasFocus: false,
        isSelected: false,
        render: 'div'
    };

    get children() {
        const { item } = this.props;
        const isString = typeof item === 'string';

        return isString ? item : null;
    }

    render() {
        const {
            classes,
            hasFocus,
            isSelected,
            item,
            itemIndex,
            render,
            ...restProps
        } = this.props;
        const customProps = { classes, hasFocus, isSelected, item, itemIndex };
        const Root = fromRenderProp(render, Object.keys(customProps));

        return (
            <Root className={classes.root} {...customProps} {...restProps}>
                {this.children}
            </Root>
        );
    }
}

export default Item;
