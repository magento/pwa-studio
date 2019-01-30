import { connect } from 'src/drivers';

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

// TODO: refactor to avoid all these selectors for simple object properties

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
    { fetchOrderDetails }
)(purchaseDetailsPage);
