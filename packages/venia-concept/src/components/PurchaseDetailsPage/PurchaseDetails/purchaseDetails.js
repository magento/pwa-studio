import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'src/components/Button';
import classify from 'src/classify';
import defaultClasses from './purchaseDetails.css';
import OrderItem from '../OrderItem';
import { itemPropType } from '../OrderItem/constants';
import OrderItemsList from '../OrderItemsList';
import DetailsBlock from '../DetailsBlock';
import { getProductPageUrl } from './helpers';

class PurchaseDetails extends Component {
    static propTypes = {
        shipmentDetails: PropTypes.array,
        orderDetails: PropTypes.array,
        paymentDetails: PropTypes.array,
        orderSummary: PropTypes.array,
        classes: PropTypes.shape({}),
        addItemToCart: PropTypes.func,
        item: itemPropType,
        otherItems: PropTypes.arrayOf(itemPropType)
    };

    handleShare = item => {
        const { history } = this.props;

        history.push(getProductPageUrl(item));
    };

    render() {
        const {
            shipmentDetails,
            orderDetails,
            paymentDetails,
            orderSummary,
            classes,
            item,
            otherItems,
            addItemToCart
        } = this.props;

        return (
            <div className={classes.root}>
                <OrderItem
                    item={item}
                    onShare={this.handleShare}
                    onBuyAgain={addItemToCart}
                />
                <h2 className={classes.orderDetailsHeaderText}>
                    Order details
                </h2>
                <DetailsBlock
                    rows={orderDetails}
                    classes={{ root: classes.orderDetailsBlockRoot }}
                />
                <OrderItemsList
                    items={otherItems}
                    title="Other Items in this Order"
                    onShare={this.handleShare}
                    onBuyAgain={addItemToCart}
                />
                <h3 className={classes.detailsBlockHeaderText}>
                    Shipment Details
                </h3>
                <DetailsBlock
                    classes={{ root: classes.shipmentBlockRoot }}
                    rows={shipmentDetails}
                />
                <Button
                    classes={{
                        root: classes.trackButtonRoot,
                        content: classes.trackButtonContent
                    }}
                >
                    Track Order
                </Button>
                <h3 className={classes.detailsBlockHeaderText}>
                    Payment Details
                </h3>
                <DetailsBlock
                    classes={{ root: classes.customDetailsBlock }}
                    rows={paymentDetails}
                />
                <h3 className={classes.detailsBlockHeaderText}>
                    Order Summary
                </h3>
                <DetailsBlock
                    classes={{ root: classes.customDetailsBlock }}
                    rows={orderSummary}
                />
            </div>
        );
    }
}

export default classify(defaultClasses)(PurchaseDetails);
