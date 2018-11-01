import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { addItemToCart } from 'src/actions/cart/asyncActions';
import purchaseDetailsPage from './purchaseDetails';
import {
    getOrderDetails,
    getPaymentDetails,
    getShipmentDetails,
    getOrderSummary,
    getOtherItems,
    getItem
} from './selectors';

export default compose(
    connect(
        state => ({
            shipmentDetails: getShipmentDetails(state),
            orderDetails: getOrderDetails(state),
            paymentDetails: getPaymentDetails(state),
            orderSummary: getOrderSummary(state),
            otherItems: getOtherItems(state),
            item: getItem(state)
        }),
        { addItemToCart }
    ),
    withRouter
)(purchaseDetailsPage);
