import { useEffect } from 'react';
import { useUserContext } from '../../../context/user';
import { useLazyQuery } from '@apollo/client';

import mergeOperations from '../../../util/shallowMerge';
import DEFAULT_OPERATIONS from './orderConfirmationPage.gql';

export const flattenGuestCartData = data => {
    if (!data) {
        return;
    }
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
        street: address.street
    };
};

export const flattenCustomerOrderData = data => {
    if (!data) {
        return;
    }
    const { customer } = data;
    const order = customer.orders.items[0];
    const { shipping_address: address } = order;

    return {
        city: address.city,
        country: address.country_code,
        email: customer.email,
        firstname: address.firstname,
        lastname: address.lastname,
        postcode: address.postcode,
        region: address.region,
        street: address.street,
        shippingMethod: order.shipping_method
    };
};

export const useOrderConfirmationPage = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getOrderConfirmationDetailsQuery } = operations;

    const [{ isSignedIn }] = useUserContext();

    const [
        fetchOrderConfirmationDetails,
        { data: queryData, error, loading }
    ] = useLazyQuery(getOrderConfirmationDetailsQuery);

    const flatData =
        flattenGuestCartData(props.data) || flattenCustomerOrderData(queryData);

    useEffect(() => {
        if (props.orderNumber && !props.data) {
            const orderNumber = props.orderNumber;
            fetchOrderConfirmationDetails({
                variables: {
                    orderNumber
                }
            });
        }
    }, [props.orderNumber, props.data, fetchOrderConfirmationDetails]);

    return {
        flatData,
        isSignedIn,
        error,
        loading
    };
};
