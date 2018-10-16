import React, { Component } from 'react';
import PropTypes from 'prop-types';

import fromRenderProp from '../util/fromRenderProp';
import iterable from '../validators/iterable';
import Items from './items';

class List extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        getItemKey: PropTypes.func.isRequired,
        items: iterable.isRequired,
        render: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
            .isRequired,
        renderItem: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
        onSelectionChange: PropTypes.func,
        selectionModel: PropTypes.oneOf(['checkbox', 'radio'])
    };

    static defaultProps = {
        classes: {},
        getItemKey: ({ id }) => id,
        items: [],
        render: 'div',
        renderItem: 'div',
        selectionModel: 'radio'
    };

    render() {
        const {
            classes,
            getItemKey,
            items,
            render,
            renderItem,
            onSelectionChange,
            selectionModel,
            ...restProps
        } = this.props;

        const customProps = {
            classes,
            getItemKey,
            items,
            onSelectionChange,
            selectionModel
        };

        const Root = fromRenderProp(render, Object.keys(customProps));

        return (
            <Root className={classes.root} {...customProps} {...restProps}>
                <Items
                    items={items}
                    getItemKey={getItemKey}
                    renderItem={renderItem}
                    selectionModel={selectionModel}
                    onSelectionChange={this.handleSelectionChange}
                />
            </Root>
        );
    }

    handleSelectionChange = selection => {
        const { onSelectionChange } = this.props;

        if (onSelectionChange) {
            onSelectionChange(selection);
        }
    };
}

export default List;
