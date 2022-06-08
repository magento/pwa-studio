const canHandle = event => event.type === 'CHECKOUT_PLACE_ORDER_BUTTON_CLICKED';

const handle = (sdk, event) => {
    const { payload } = event;

    const grandTotal = payload.amount.grand_total.value;

    const { payment, shipping } = payload;

    const orderContext = {
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
};

export default {
    canHandle,
    handle
};
