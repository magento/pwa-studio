import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../../context/cart';

/**
 * Contains logic for a shipping method selector component.
 * It performs effect and returns props data used to render that component.
 *
 * @function
 *
 * @param {Object} props
 * @param {ShippingMethodsQueries} props.queries GraphQL queries for shipping methods
 *
 * @returns {ShippingMethodsProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useShippingMethods } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingMethods';
 */
export const useShippingMethods = props => {
    const {
        /**
         * GraphQL queries for shipping methods.
         * This is a type used in the {@link useShippingMethods} talon.
         *
         * @typedef {Object} ShippingMethodsQueries
         *
         * @property {GraphQLAST} getShippingMethodsQuery Query to get the available shipping methods.
         *
         * @see [shippingMethods.gql.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/ShippingMethods/shippingMethods.gql.js}
         * for the queries used in Venia
         */
        queries: { getShippingMethodsQuery }
    } = props;
    const [{ cartId }] = useCartContext();
    const { data } = useQuery(getShippingMethodsQuery, {
        fetchPolicy: 'cache-and-network',
        skip: !cartId,
        variables: {
            cartId
        }
    });

    const [isShowingForm, setIsShowingForm] = useState(false);
    const showForm = useCallback(() => setIsShowingForm(true), []);

    useEffect(() => {
        if (data && data.cart.shipping_addresses.length) {
            setIsShowingForm(true);
        }
    }, [data]);

    let formattedShippingMethods = [];
    let selectedShippingMethod = null;
    let selectedShippingFields = {
        country: 'US',
        region: '',
        zip: ''
    };
    if (data) {
        const { cart } = data;
        const { shipping_addresses: shippingAddresses } = cart;
        if (shippingAddresses.length) {
            const primaryShippingAddress = shippingAddresses[0];
            const {
                available_shipping_methods: shippingMethods,
                country,
                postcode,
                region,
                selected_shipping_method: shippingMethod
            } = primaryShippingAddress;

            selectedShippingFields = {
                country: country.code,
                region: region.code,
                zip: postcode
            };

            // GraphQL has some sort order problems when updating the cart.
            // This ensures we're always ordering the result set by price.
            formattedShippingMethods = [...shippingMethods].sort(
                (a, b) => a.amount.value - b.amount.value
            );

            if (shippingMethod) {
                selectedShippingMethod = `${shippingMethod.carrier_code}|${
                    shippingMethod.method_code
                }`;
            }
        }
    }

    /**
     * Object type returned by the {@link useShippingMethods} talon.
     * It provides prop data to use when rendering shipping methods.
     *
     * @typedef {Object} ShippingMethodsProps
     *
     * @property {number} hasMethods Provides the number of shipping methods available.
     * Can be used as a boolean value since having no shipping methods would return 0.
     * @property {boolean} isShowingForm True if the form should be shown. False otherwise.
     * @property {SelectShippingFields} selectedShippingFields Values for the select input fields on the shipping form
     * @property {String} selectedShippingMethod The carrier code or method code for the selected shipping method
     * @property {Array<Object>} shippingMethods A list of available shipping methods based on the primary shipping address
     * @property {Function} showForm A function that sets the `isShowingForm` value to true.
     */
    return {
        hasMethods: formattedShippingMethods.length,
        isShowingForm,
        selectedShippingFields,
        selectedShippingMethod,
        shippingMethods: formattedShippingMethods,
        showForm
    };
};
