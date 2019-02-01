export const getOrderInformation = (
    { cart: { details: { billing_address } = {} } },
    orderId
) => ({
    id: orderId,
    billing_address
});

export const isEmptyCartVisible = ({ cart, checkout: { step } }) =>
    step === 'cart' && (!cart.details.items || cart.details.items.length === 0);

export const isMiniCartMaskOpen = ({ checkout: { step } }) => step === 'form';
