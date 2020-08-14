import React from 'react';
import { arrayOf, node, shape, string } from 'prop-types';
import { useStockStatusMessage } from '@magento/peregrine/lib/talons/StockStatusMessage/useStockStatusMessage';

import { mergeClasses } from '../../classify';
import defaultClasses from './stockStatusMessage.css';

const StockStatusMessage = props => {
    const { cartItems, message } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useStockStatusMessage({ cartItems });
    const { hasOutOfStockItem } = talonProps;

    const stockStatusMessageElement = hasOutOfStockItem ? (
        <p className={classes.root}>{message}</p>
    ) : null;

    return stockStatusMessageElement;
};

export default StockStatusMessage;

StockStatusMessage.defaultProps = {
    message:
        'An item in your cart is currently out-of-stock and must be removed in order to Checkout.'
};

StockStatusMessage.propTypes = {
    cartItems: arrayOf(
        shape({
            product: shape({
                stock_status: string
            })
        })
    ),
    message: node
};
