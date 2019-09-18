export const isCartEmpty = ({ cart }) =>
    !cart.details.items || cart.details.items.length === 0;
