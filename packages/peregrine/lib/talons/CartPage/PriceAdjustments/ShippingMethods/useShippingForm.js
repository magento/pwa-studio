import { useCallback, useEffect } from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../../../context/cart';

/**
 * GraphQL currently requires a complete address before it will return
 * estimated shipping prices, even though it only needs Country, State,
 * and Zip. Assuming this is a bug or oversight, we're going to mock the
 * data points we don't want to bother collecting from the Customer at this
 * step in the process. We need to be very mindful that these values are never
 * displayed to the user.
 */
export const MOCKED_ADDRESS = {
    city: 'city',
    firstname: 'firstname',
    lastname: 'lastname',
    street: ['street'],
    telephone: 'telephone'
};

export const useShippingForm = props => {
    const {
        selectedValues,
        setIsCartUpdating,
        mutations: { setShippingAddressMutation },
        queries: { shippingMethodsQuery }
    } = props;

    const [{ cartId }] = useCartContext();
    const apolloClient = useApolloClient();

    const [
        setShippingAddress,
        { called: setShippingAddressCalled, loading: isSetShippingLoading }
    ] = useMutation(setShippingAddressMutation);

    useEffect(() => {
        if (setShippingAddressCalled) {
            setIsCartUpdating(isSetShippingLoading);
        }
    }, [isSetShippingLoading, setIsCartUpdating, setShippingAddressCalled]);

    /**
     * When the zip value is changed, go ahead and manually wipe out that
     * portion of the cache, which will cause the components subscribed to
     * that state to re-render. Ideally we would send a mutation to clear the
     * shipping address set on the cart, to keep those states in sync, but the
     * GraphQL API does not currently supported clearing addresses.
     */
    const handleZipChange = useCallback(
        zip => {
            if (zip !== selectedValues.zip) {
                const data = apolloClient.readQuery({
                    query: shippingMethodsQuery,
                    variables: {
                        cartId
                    }
                });

                const { cart } = data;
                const { shipping_addresses: shippingAddresses } = cart;
                if (shippingAddresses.length) {
                    const primaryAddress = shippingAddresses[0];
                    const {
                        available_shipping_methods: availableMethods
                    } = primaryAddress;
                    if (availableMethods.length) {
                        apolloClient.writeQuery({
                            query: shippingMethodsQuery,
                            data: {
                                cart: {
                                    ...cart,
                                    shipping_addresses: [
                                        {
                                            ...primaryAddress,
                                            available_shipping_methods: []
                                        }
                                    ]
                                }
                            }
                        });
                    }
                }
            }
        },
        [apolloClient, cartId, selectedValues.zip, shippingMethodsQuery]
    );

    const handleOnSubmit = useCallback(
        formValues => {
            const { country, region, zip } = formValues;
            if (country && region && zip) {
                setShippingAddress({
                    variables: {
                        cartId,
                        address: {
                            ...MOCKED_ADDRESS,
                            country_code: country,
                            postcode: zip,
                            region
                        }
                    }
                });
            }
        },
        [cartId, setShippingAddress]
    );

    return {
        handleOnSubmit,
        handleZipChange,
        isSetShippingLoading
    };
};
