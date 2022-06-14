const canHandle = event => event.type === 'ORDER_CONFIRMATION_PAGE_VIEW';

const handle = (sdk, event) => {
    const { payload } = event;

    const grandTotal = payload.amount.grand_total.value;

    const { order_number, payment, shipping } = payload;

    const orderContext = {
        orderId: order_number,
        grandTotal: grandTotal,
        orderType: 'checkout',
        payments: [
            {
                paymentMethodCode: payment.title,
                paymentMethodName: payment.title,
                total: grandTotal
            }
        ],
        shipping: {
            shippingMethod: shipping[0].method_title,
            shippingAmount: shipping[0].amount.value
        }
    };

    sdk.context.setOrder(orderContext);

    sdk.publish.placeOrder();

    // Send out page view event
    const pageContext = {
        pageType: 'Order Confirmation Page',
        pageName: 'Order Confirmation',
        eventType: 'visibilityHidden',
        maxXOffset: 0,
        maxYOffset: 0,
        minXOffset: 0,
        minYOffset: 0
    };

    sdk.context.setPage(pageContext);
    sdk.publish.pageView();
};

export default {
    canHandle,
    handle
};
