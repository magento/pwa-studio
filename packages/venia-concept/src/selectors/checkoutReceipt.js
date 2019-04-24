export const getOrderInformation = ({ checkoutReceipt: { order } }) => order;

export const getAccountInformation = ({
    checkoutReceipt: {
        order: {
            billing_address: {
                email,
                firstname: firstName,
                lastname: lastName
            } = {}
        }
    }
}) => ({ email, firstName, lastName });
