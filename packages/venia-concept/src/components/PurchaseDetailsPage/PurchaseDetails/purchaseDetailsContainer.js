import { connect } from 'react-redux';

import { addItemToCart } from 'src/actions/cart/asyncActions';
import { fetchOrderDetails } from 'src/actions/purchaseDetails/asyncActions';
import purchaseDetailsPage from './purchaseDetails';
import {
    getCommonOrderDetails,
    getPaymentDetails,
    getShipmentDetails,
    getOrderSummary,
    getFetchingStatus,
    getOtherItems,
    getItem
} from './selectors';

export default connect(
    state => ({
        shipmentDetails: getShipmentDetails(state),
        orderDetails: getCommonOrderDetails(state),
        paymentDetails: getPaymentDetails(state),
        orderSummary: getOrderSummary(state),
        isFetching: getFetchingStatus(state),
        otherItems: getOtherItems(state),
        item: getItem(state)
    }),
    { addItemToCart, fetchOrderDetails }
)(purchaseDetailsPage);
