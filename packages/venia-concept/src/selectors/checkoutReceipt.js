export const getOrderInformation = ({ checkoutReceipt: { order } }) => order;

export const getAccountInformation = ({
    checkoutReceipt: {
        order: {
            shipping_address: {
                email,
                firstname: firstName,
                lastname: lastName
            } = {}
        }
    }
}) => ({ email, firstName, lastName });
