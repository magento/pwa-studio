// TODO: implement selectors
const getPurchaseDetails = state => state.purchaseDetails;

const getOrderDetails = state => getPurchaseDetails(state).orderDetails;

export const getCommonOrderDetails = state => {
    const orderDetails = getOrderDetails(state);

    return [
        { property: 'Order No', value: orderDetails.orderNo },
        { property: 'Order Date', value: orderDetails.orderDate },
        { property: 'Total', value: orderDetails.total },
        { property: 'Products', value: orderDetails.products }
    ];
};

export const getShipmentDetails = state => {
    const orderDetails = getOrderDetails(state);

    return [
        { property: 'Method', value: orderDetails.shippingMethod },
        { property: 'Delivered', value: orderDetails.delivered }
    ];
};

export const getPaymentDetails = state => {
    const orderDetails = getOrderDetails(state);

    return [
        { property: 'Method', value: orderDetails.paymentMethod },
        {
            property: 'Billing Address',
            value: orderDetails.billingAddress
        },
        {
            property: 'Shipping Address',
            value: orderDetails.shippingAddress
        }
    ];
};

export const getOrderSummary = state => {
    const orderDetails = getOrderDetails(state);

    return [
        { property: 'Items', value: orderDetails.items },
        {
            property: 'Shipping and Handling',
            value: orderDetails.shippingAndHandling
        },
        { property: 'Estimated Tax', value: orderDetails.estimatedTax }
    ];
};

export const getFetchingStatus = state => getPurchaseDetails(state).isFetching;

export const getItem = state => getPurchaseDetails(state).item;

export const getOtherItems = state => getPurchaseDetails(state).otherItems;
