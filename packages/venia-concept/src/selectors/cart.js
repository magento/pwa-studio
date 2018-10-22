export const isEmptyCartVisible = ({ cart, checkout: { step } }) =>
    step === 'cart' && (!cart.details.items || cart.details.items.length === 0);
