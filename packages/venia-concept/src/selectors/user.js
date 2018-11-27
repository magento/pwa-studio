import { getCountryName } from './directory';

const getAddress = (state, findCallback) => {
    const {
        user: {
            currentUser: { addresses }
        }
    } = state;
    const address = addresses.find(findCallback);

    return address
        ? { ...address, country: getCountryName(state, address.country_id) }
        : null;
};

const getDefaultShippingAddress = state =>
    getAddress(state, ({ default_shipping }) => default_shipping);

const getDefaultBillingAddress = state =>
    getAddress(state, ({ default_billing }) => default_billing);

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
