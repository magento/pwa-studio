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
};

export default {
    canHandle,
    handle
};
