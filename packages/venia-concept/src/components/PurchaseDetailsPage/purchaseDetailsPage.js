import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Page from 'src/components/Page';
import Button from 'src/components/Button';
import classify from 'src/classify';
import defaultClasses from './purchaseDetailsPage.css';
import OrderItem from './OrderItem';
import OrderItemsList from './OrderItemsList';
import DetailsBlock from './DetailsBlock';
import {
    shipmentDetailsMock,
    orderDetailsMock,
    paymentDetailsMock,
    orderSummaryMock
} from './purchaseDetailsMocks';

class PurchaseDetailsPage extends Component {
    static propTypes = {
        shipmentDetails: PropTypes.array,
        orderDetails: PropTypes.array,
        paymentDetails: PropTypes.array,
        orderSummary: PropTypes.array,
        classes: PropTypes.shape({}),
        otherItems: PropTypes.shape({})
    };

    // TODO: implement data fetching
    static defaultProps = {
        shipmentDetails: shipmentDetailsMock,
        orderDetails: orderDetailsMock,
        paymentDetails: paymentDetailsMock,
        orderSummary: orderSummaryMock,
        otherItems: [{}, {}]
    };

    render() {
        const {
            shipmentDetails,
            orderDetails,
            paymentDetails,
            orderSummary,
            classes,
            otherItems
        } = this.props;

        return (
            <Page>
                <div className={classes.root}>
                    <OrderItem />
                    <h2>Order details</h2>
                    <DetailsBlock rows={orderDetails} />
                    <OrderItemsList items={otherItems} />
                    <h3>Shipment Details</h3>
                    <DetailsBlock rows={shipmentDetails} />
                    <Button>Track Order</Button>
                    <h3>Payment Details</h3>
                    <DetailsBlock rows={paymentDetails} />
                    <h3>Order Summary</h3>
                    <DetailsBlock rows={orderSummary} />
                </div>
            </Page>
        );
    }
}

export default classify(defaultClasses)(PurchaseDetailsPage);
