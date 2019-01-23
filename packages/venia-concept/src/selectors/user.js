const getDefaultShippingAddress = ({
    user: {
        currentUser: { addresses }
    }
}) => addresses.find(({ default_shipping }) => default_shipping);

const getDefaultBillingAddress = ({
    user: {
        currentUser: { addresses }
    }
}) => addresses.find(({ default_billing }) => default_billing);

export const getCurrentUser = ({ user: { currentUser } }) => currentUser;

export const getAccountAddressList = state => [
    {
        title: 'Default Billing Address',
        address: getDefaultBillingAddress(state)
    },
    {
        title: 'Default Shipping Address',
        address: getDefaultShippingAddress(state)
    }
];
export const getUserInformation = ({ user: { currentUser } }) => {
    const { email, firstname, lastname } = currentUser;

    return {
        email,
        firstname,
        lastname,
        fullname: `${firstname} ${lastname}`
    };
};
