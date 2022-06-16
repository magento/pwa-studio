import { useCallback, useEffect, useMemo } from 'react';
import { useFormState, useFormApi } from 'informed';
import { useQuery, useApolloClient, useMutation, useLazyQuery } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './billingAddress.gql';

/**
 * Maps address response data from GET_BILLING_ADDRESS and GET_SHIPPING_ADDRESS
 * queries to input names in the billing address form.
 * {@link creditCard.gql.js}.
 *
 * @param {ShippingCartAddress|BillingCartAddress} rawAddressData query data
 */
export const mapAddressData = rawAddressData => {
    if (rawAddressData) {
        const { firstName, lastName, city, postcode, phoneNumber, street, country, region } = rawAddressData;

        return {
            firstName,
            lastName,
            city,
            postcode,
            phoneNumber,
            street1: street[0],
            street2: street[1],
            country: country.code,
            region: region.code
        };
    } else {
        return {};
    }
};

export const getDefaultBillingAddress = customerAddressesData => {
    if (customerAddressesData != undefined) {
        const { customer } = customerAddressesData;

        if (customer) {
            const { addresses } = customer;

            const defaultBillingAddressArray = addresses.filter(address => address.default_billing == true);
            if (defaultBillingAddressArray.length > 0) {
                return defaultBillingAddressArray[0];
            }
        }
    }
    return {};
};

/**
 * Talon to handle Billing address for payment forms.
 *
 * @param {Boolean} props.shouldSubmit boolean value which represents if a payment nonce request has been submitted
 * @param {Function} props.onBillingAddressChangedError callback to invoke when an error was thrown while setting the billing address
 * @param {Function} props.onBillingAddressChangedSuccess callback to invoke when address was sucessfully set
 * @param {DocumentNode} props.operations.getShippingAddressQuery query to fetch shipping address from cache
 * @param {DocumentNode} props.operations.getBillingAddressQuery query to fetch billing address from cache
 * @param {DocumentNode} props.operations.getIsBillingAddressSameQuery query to fetch is billing address same checkbox value from cache
 * @param {DocumentNode} props.operations.setBillingAddressMutation mutation to update billing address on the cart
 *
 * @returns {
 *   errors: Map<String, Error>,
 *   isBillingAddressSame: Boolean,
 *   initialValues: {
 *      firstName: String,
 *      lastName: String,
 *      city: String,
 *      postcode: String,
 *      phoneNumber: String,
 *      street1: String,
 *      street2: String,
 *      country: String,
 *      state: String,
 *      isBillingAddressSame: Boolean
 *   },
 *   shippingAddressCountry: String,
 * }
 */
export default original => {
    return function useBillingAddress(props, ...restArgs) {
        const { shouldSubmit, onBillingAddressChangedError, onBillingAddressChangedSuccess } = props;

        const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

        const {
            getBillingAddressQuery,
            getShippingAddressQuery,
            getIsBillingAddressSameQuery,
            setBillingAddressMutation,
            getCustomerAddressesQuery,
            setDefaultBillingAddressMutation
        } = operations;

        const client = useApolloClient();
        const formState = useFormState();
        const { validate: validateBillingAddressForm } = useFormApi();
        const [{ cartId }] = useCartContext();
        const [{ isSignedIn }] = useUserContext();

        const { data: customerAddressesData } = useQuery(getCustomerAddressesQuery, {
            fetchPolicy: 'cache-and-network',
            skip: !isSignedIn
        });

        const { data: shippingAddressData } = useQuery(getShippingAddressQuery, {
            skip: !cartId,
            variables: { cartId }
        });

        const { data: isBillingAddressSameData } = useQuery(getIsBillingAddressSameQuery, {
            skip: !cartId,
            variables: { cartId }
        });

        const [loadBillingAddressQuery, { data: billingAddressData }] = useLazyQuery(getBillingAddressQuery, {
            skip: !cartId,
            variables: { cartId }
        });

        const [
            updateBillingAddress,
            {
                error: billingAddressMutationError,
                called: billingAddressMutationCalled,
                loading: billingAddressMutationLoading
            }
        ] = useMutation(setBillingAddressMutation);

        const [
            updateDefaultBillingAddress,
            {
                error: defaultBillingAddressMutationError,
                called: defaultBillingAddressMutationCalled,
                loading: defaultBillingAddressMutationLoading
            }
        ] = useMutation(setDefaultBillingAddressMutation);

        const shippingAddressCountry = shippingAddressData
            ? shippingAddressData.cart.shippingAddresses[0].country.code
            : 'US';

        const defaultBillingAddressObject = getDefaultBillingAddress(customerAddressesData);

        const isBillingAddressDefault = Object.keys(defaultBillingAddressObject).length > 0 ? true : false;

        const initialValues = useMemo(() => {
            let billingAddress = {};
            /**
             * If billing address is same as shipping address, do
             * not auto fill the fields.
             */
            if (billingAddressData && !isBillingAddressDefault) {
                if (billingAddressData.cart.billingAddress) {
                    const {
                        // eslint-disable-next-line no-unused-vars
                        __typename,
                        ...rawBillingAddress
                    } = billingAddressData.cart.billingAddress;
                    billingAddress = mapAddressData(rawBillingAddress);
                }
            }

            return { isBillingAddressDefault, ...billingAddress, defaultBillingAddressObject };
        }, [isBillingAddressSameData, billingAddressData, defaultBillingAddressObject]);

        /**
         * Helpers
         */

        /**
         * This function sets the boolean isBillingAddressSame
         * in cache for future use. We use cache because there
         * is no way to save this on the cart in remote.
         */
        const setIsBillingAddressSameInCache = useCallback(() => {
            client.writeQuery({
                query: getIsBillingAddressSameQuery,
                data: {
                    cart: {
                        __typename: 'Cart',
                        id: cartId,
                        isBillingAddressSame: isBillingAddressDefault
                    }
                }
            });
        }, [client, cartId, getIsBillingAddressSameQuery, isBillingAddressDefault]);

        /**
         * This function sets the billing address on the cart using the
         * shipping address.
         */
        const setShippingAddressAsBillingAddress = useCallback(() => {
            const shippingAddress = shippingAddressData
                ? mapAddressData(shippingAddressData.cart.shippingAddresses[0])
                : {};

            updateBillingAddress({
                variables: {
                    cartId,
                    ...shippingAddress,
                    sameAsShipping: true
                }
            });
        }, [updateBillingAddress, shippingAddressData, cartId]);

        const setDefaultBillingAddress = useCallback(() => {
            const {
                defaultBillingAddressObject: { id }
            } = initialValues;

            updateDefaultBillingAddress({
                variables: {
                    cartId,
                    customerAddressId: id
                }
            });
        }, [updateDefaultBillingAddress, initialValues, cartId]);

        /**
         * This function sets the billing address on the cart using the
         * information from the form.
         */
        const setBillingAddress = useCallback(() => {
            const {
                firstName,
                lastName,
                country,
                street1,
                street2,
                city,
                region,
                postcode,
                phoneNumber
            } = formState.values;

            updateBillingAddress({
                variables: {
                    cartId,
                    firstName,
                    lastName,
                    country,
                    street1,
                    street2,
                    city,
                    region,
                    postcode,
                    phoneNumber,
                    sameAsShipping: false
                }
            });
        }, [formState.values, updateBillingAddress, cartId]);

        /**
         * Effects
         */

        /**
         * Loads billing address if is different to shipment address.
         */
        useEffect(() => {
            if (!isBillingAddressDefault) {
                loadBillingAddressQuery();
            }
        }, [isBillingAddressDefault, loadBillingAddressQuery]);

        /**
         *
         * User has clicked the update button
         */
        useEffect(() => {
            try {
                if (shouldSubmit) {
                    /**
                     * Validate billing address fields and only process with
                     * submit if there are no errors.
                     *
                     * We do this because the user can click Review Order button
                     * without filling in all fields and the form submission
                     * happens manually. The informed Form component validates
                     * on submission but that only happens when we use the onSubmit
                     * prop. In this case we are using manually submission because
                     * of the nature of the credit card submission process.
                     */
                    validateBillingAddressForm();

                    if (isBillingAddressDefault) {
                        setDefaultBillingAddress();
                        setIsBillingAddressSameInCache();
                    } else {
                        const hasErrors = Object.keys(formState.errors).length;
                        if (!hasErrors) {
                            setBillingAddress();
                            setIsBillingAddressSameInCache();
                        } else {
                            throw new Error('Errors in the billing address form');
                        }
                    }
                }
            } catch (err) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(err);
                }
                onBillingAddressChangedError();
            }
        }, [
            shouldSubmit,
            isBillingAddressDefault,
            setShippingAddressAsBillingAddress,
            setBillingAddress,
            setIsBillingAddressSameInCache,
            onBillingAddressChangedError,
            onBillingAddressChangedSuccess,
            validateBillingAddressForm,
            formState.errors
        ]);

        /**
         * Billing address mutation has completed
         */
        useEffect(() => {
            try {
                const billingAddressMutationCompleted = billingAddressMutationCalled && !billingAddressMutationLoading;

                if (billingAddressMutationCompleted && !billingAddressMutationError) {
                    onBillingAddressChangedSuccess();
                }

                if (billingAddressMutationCompleted && billingAddressMutationError) {
                    /**
                     * Billing address save mutation is not successful.
                     * Reset update button clicked flag.
                     */
                    throw new Error('Billing address mutation failed');
                }
            } catch (err) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(err);
                }
                onBillingAddressChangedError();
            }
        }, [
            billingAddressMutationError,
            billingAddressMutationCalled,
            billingAddressMutationLoading,
            onBillingAddressChangedError,
            onBillingAddressChangedSuccess
        ]);

        /**
         * Default billing address mutation has completed
         */
        useEffect(() => {
            try {
                const billingAddressMutationCompleted =
                    defaultBillingAddressMutationCalled && !defaultBillingAddressMutationLoading;

                if (billingAddressMutationCompleted && !defaultBillingAddressMutationError) {
                    onBillingAddressChangedSuccess();
                }

                if (billingAddressMutationCompleted && defaultBillingAddressMutationError) {
                    /**
                     * Billing address save mutation is not successful.
                     * Reset update button clicked flag.
                     */
                    throw new Error('Billing address mutation failed');
                }
            } catch (err) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(err);
                }
                onBillingAddressChangedError();
            }
        }, [
            defaultBillingAddressMutationError,
            defaultBillingAddressMutationCalled,
            defaultBillingAddressMutationLoading,
            onBillingAddressChangedError,
            onBillingAddressChangedSuccess
        ]);

        const errors = useMemo(
            () =>
                new Map([
                    ['setBillingAddressMutation', billingAddressMutationError],
                    ['setBillingAddressMutation', defaultBillingAddressMutationError]
                ]),
            [billingAddressMutationError, defaultBillingAddressMutationError]
        );

        return {
            errors,
            isBillingAddressDefault,
            initialValues,
            shippingAddressCountry
        };
    };
};
