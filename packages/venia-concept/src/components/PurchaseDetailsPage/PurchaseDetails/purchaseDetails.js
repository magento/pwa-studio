import React, { Component } from 'react';
import { any, array, bool, func, shape, string } from 'prop-types';

import classify from 'src/classify';
import Button from 'src/components/Button';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import OrderItem from '../OrderItem';
import OrderItemsList from '../OrderItemsList';
import DetailsBlock from '../DetailsBlock';
import defaultClasses from './purchaseDetails.css';

class PurchaseDetails extends Component {
    static propTypes = {
        addItemToCart: func,
        classes: shape({
            heading: string,
            root: string,
            shipmentActions: string
        }).isRequired,
        fetchOrderDetails: func.isRequired,
        isFetching: bool,
        item: any,
        orderDetails: array,
        orderSummary: array,
        otherItems: array,
        paymentDetails: array,
        shipmentDetails: array
    };

    componentDidMount() {
        //TODO: implement executing url params for orderId and itemId
        this.props.fetchOrderDetails({});
    }

    render() {
        const {
            addItemToCart,
            classes,
            isFetching,
            item,
            orderDetails,
            orderSummary,
            otherItems,
            paymentDetails,
            shipmentDetails
        } = this.props;

        if (isFetching) {
            return loadingIndicator;
        }

        return (
            <div className={classes.root}>
                <OrderItem
                    item={item}
                    onShare={this.handleShare}
                    onBuyAgain={addItemToCart}
                />
                <h2 className={classes.heading}>Order Details</h2>
                <DetailsBlock rows={orderDetails} />
                <OrderItemsList
                    items={otherItems}
                    title="Other Items in this Order"
                    onShare={this.handleShare}
                    onBuyAgain={addItemToCart}
                />
                <h3 className={classes.heading}>Shipment Details</h3>
                <DetailsBlock rows={shipmentDetails} />
                <div className={classes.shipmentActions}>
                    <Button>Track Order</Button>
                </div>
                <h3 className={classes.heading}>Payment Details</h3>
                <DetailsBlock rows={paymentDetails} />
                <h3 className={classes.heading}>Order Summary</h3>
                <DetailsBlock rows={orderSummary} />
            </div>
        );
    }
}

export default classify(defaultClasses)(PurchaseDetails);
