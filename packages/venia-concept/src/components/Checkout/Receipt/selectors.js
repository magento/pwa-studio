export const getOrderInformation = ({ checkoutReceipt: { order } }) => order;

export const getAccountInformation = ({
    checkoutReceipt: { email, firstName, lastName }
}) => ({ email, firstName, lastName });
