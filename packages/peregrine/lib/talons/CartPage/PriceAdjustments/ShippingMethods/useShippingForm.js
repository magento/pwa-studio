import { useCallback, useEffect, useMemo } from 'react';
import { useApolloClient, useMutation } from '@apollo/client';

import { useCartContext } from '../../../../context/cart';

/**
 * GraphQL currently requires a complete address before it will return
 * estimated shipping prices, even though it only needs Country, State,
 * and Zip. Assuming this is a bug or oversight, we're going to mock the
 * data points we don't want to bother collecting from the Customer at this
 * step in the process. We need to be very mindful that these values are never
 * displayed to the user.
 *
 * @ignore
 */
export const MOCKED_ADDRESS = {
    city: 'city',
    firstname: 'firstname',
    lastname: 'lastname',
    street: ['street'],
    telephone: 'telephone'
};

/**
 * Contains logic for a shipping form component.
 * It performs effects and returns props data related to rendering a shipping address form.
 *
 * This talon performs the following effects:
 *
 * - Manage the updating state of the cart while the mutation for setting the shipping address is in flight
 *
 * @function
 *
 * @param {Object} props
 * @param {SelectShippingFields} props.selectedValues The values from the select input fields in the shipping form
 * @param {function} props.setIsCartUpdating Callback function for setting the update state for the cart.
 * @param {ShippingFormMutations} props.mutations GraphQL mutations for the shipping form.
 * @param {ShippingFormQueries} props.queries GraphQL queries for the shipping form.
 *
 * @returns {ShippingFormTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useShippingForm } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingForm';
 */
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
        {
            called: isSetShippingAddressCalled,
            error: errorSettingShippingAddress,
            loading: isSetShippingLoading
        }
    ] = useMutation(setShippingAddressMutation);

    useEffect(() => {
        if (isSetShippingAddressCalled) {
            setIsCartUpdating(isSetShippingLoading);
        }
    }, [isSetShippingLoading, isSetShippingAddressCalled, setIsCartUpdating]);

    /**
     * @ignore
     *
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

    const errors = useMemo(
        () =>
            new Map([
                ['setShippingAddressMutation', errorSettingShippingAddress]
            ]),
        [errorSettingShippingAddress]
    );

    return {
        errors,
        handleOnSubmit,
        handleZipChange,
        isSetShippingLoading
    };
};

/** JSDocs type definitions */

/**
 * Values for the select input fields on the shipping form.
 * This is a prop used by the {@link useShippingForm} talon.
 *
 * @typedef {Object} SelectShippingFields
 *
 * @property {String} country Country shipping destination
 * @property {String} region Country's region shipping destination
 * @property {String} zip Country's zip code shipping destination
 */

/**
 * GraphQL mutations for the shipping form.
 * This is a type used by the {@link useShippingForm} talon.
 *
 * @typedef {Object} ShippingFormMutations
 *
 * @property {GraphQLAST} setShippingAddressMutation Mutation for setting the shipping address on a cart
 *
 * @see [shippingForm.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/ShippingMethods/shippingForm.js}
 * for the query used in Venia
 */

/**
 * GraphQL queries for the shipping form.
 * This is a type used by the {@link useShippingForm} talon.
 *
 * @typedef {Object} ShippingFormQueries
 *
 * @property {GraphQLAST} shippingMethodsQuery Query for getting data about available shipping methods
 *
 * @see [shippingMethods.gql.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/ShippingMethods/shippingMethods.gql.js}
 * for the query used in Venia
 */

/**
 * Object type returned by the {@link useShippingForm} talon.
 * It provides props data to use when rendering a shipping form component.
 *
 * @typedef {Object} ShippingFormTalonProps
 *
 * @property {Array<Error>} formErrors A list of form errors
 * @property {function} handleOnSubmit Callback function to handle form submissions
 * @property {function} handleZipChange Callback function to handle a zip code change
 * @property {boolean} isSetShippingLoading True if the cart shipping information is being set. False otherwise.
 */
