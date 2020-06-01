import { useUserContext } from '../../../context/user';

export const flatten = data => {
    const { cart } = data;
    const { shipping_addresses } = cart;
    const address = shipping_addresses[0];

    const shippingMethod = `${
        address.selected_shipping_method.carrier_title
    } - ${address.selected_shipping_method.method_title}`;

    return {
        city: address.city,
        country: address.country.label,
        email: cart.email,
        firstname: address.firstname,
        lastname: address.lastname,
        postcode: address.postcode,
        region: address.region.label,
        shippingMethod,
        street: address.street,
        totalItemQuantity: cart.total_quantity
    };
};

export const useOrderConfirmationPage = props => {
    const { data } = props;
    const [{ isSignedIn }] = useUserContext();

    return {
        flatData: flatten(data),
        isSignedIn
    };
};
