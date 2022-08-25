import React from 'react';
import { FormattedMessage } from 'react-intl';
import { arrayOf, node, shape, string } from 'prop-types';
import { useStockStatusMessage } from '@magento/peregrine/lib/talons/StockStatusMessage/useStockStatusMessage';

import { useStyle } from '../../classify';
import defaultClasses from './stockStatusMessage.module.css';

const StockStatusMessage = props => {
    const { cartItems, messageId, message } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useStockStatusMessage({ cartItems });
    const { hasOutOfStockItem } = talonProps;

    const stockStatusMessageElement = hasOutOfStockItem ? (
        <div className={classes.root}>
            <FormattedMessage id={messageId} defaultMessage={message} />
        </div>
    ) : null;

    return stockStatusMessageElement;
};

export default StockStatusMessage;

StockStatusMessage.defaultProps = {
    messageId: 'stockStatusMessage.message',
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
    messageId: string,
    message: node
};
