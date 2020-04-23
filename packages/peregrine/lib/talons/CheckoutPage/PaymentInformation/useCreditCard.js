import { useCallback, useEffect, useState, useMemo } from 'react';
import { useFormState } from 'informed';
import { useQuery, useApolloClient, useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

export const mapAddressData = rawAddressData => {
    if (rawAddressData) {
        const {
            firstName,
            lastName,
            city,
            postalCode,
            phoneNumber,
            street,
            country,
            region
        } = rawAddressData;

        return {
            firstName,
            lastName,
            city,
            postalCode,
            phoneNumber,
            street1: street[0],
            street2: street[1],
            country: country.code,
            state: region.code
        };
    } else {
        return {};
    }
};

/**
 * Talon to handle Credit Card payment method.
 *
 * @param {Boolean} props.shouldSubmit boolean value which represents if a payment nonce request has been submitted
 * @param {Function} props.onSuccess callback to invoke when the a payment nonce has been generated
 * @param {Function} props.onReady callback to invoke when the braintree dropin component is ready
 * @param {Function} props.onError callback to invoke when the braintree dropin component throws an error
 * @param {Function} props.resetShouldSubmit callback to reset the shouldSubmit flag
 * @param {DocumentNode} props.queries.getAllCountriesQuery query to fetch all countries data
 * @param {DocumentNode} props.queries.getBillingAddressQuery query to fetch billing address from cache
 * @param {DocumentNode} props.queries.getIsBillingAddressSameQuery query to fetch is billing address same checkbox value from cache
 * @param {DocumentNode} props.queries.getPaymentNonceQuery query to fetch payment nonce saved in cache
 * @param {DocumentNode} props.mutations.setBillingAddressMutation mutation to update billing address on the cart
 * @param {DocumentNode} props.mutations.setCreditCardDetailsOnCartMutation mutation to update payment method and payment nonce on the cart
 *
 * @returns {
 *   shouldRequestPaymentNonce: Boolean,
 *   onPaymentError: Function,
 *   onPaymentSuccess: Function,
 *   onPaymentReady: Function,
 *   isBillingAddressSame: Boolean,
 *   countries: Object,
 *   isDropinLoading: Boolean,
 *   errors: Array<String>,
 *   stepNumber: Number,
 *   initialValues: {
 *      firstName: String,
 *      lastName: String,
 *      city: String,
 *      postalCode: String,
 *      phoneNumber: String,
 *      street1: String,
 *      street2: String,
 *      country: String,
 *      state: String,
 *      isBillingAddressSame: Boolean
 *   },
 *   shippingAddressCountry: String
 * }
 */
export const useCreditCard = props => {
    const {
        onSuccess,
        queries,
        mutations,
        onReady,
        onError,
        shouldSubmit,
        resetShouldSubmit
    } = props;
    const {
        getAllCountriesQuery,
        getBillingAddressQuery,
        getIsBillingAddressSameQuery,
        getPaymentNonceQuery,
        getShippingAddressQuery
    } = queries;
    const {
        setBillingAddressMutation,
        setCreditCardDetailsOnCartMutation
    } = mutations;

    /**
     * Definitions
     */

    const [isDropinLoading, setDropinLoading] = useState(true);
    const [shouldRequestPaymentNonce, setShouldRequestPaymentNonce] = useState(
        false
    );
    /**
     * `stepNumber` depicts the state of the process flow in credit card
     * payment flow.
     *
     * `0` No call made yet
     * `1` Billing address mutation intiated
     * `2` Billing address mutation completed
     * `3` Braintree nonce requsted
     * `4` Braintree nonce received
     * `5` Payment information mutation intiated
     * `6` Payment information mutation completed
     * `7` All mutations done
     */
    const [stepNumber, setStepNumber] = useState(0);

    const client = useApolloClient();
    const formState = useFormState();
    const [{ cartId }] = useCartContext();

    const { data: countriesData } = useQuery(getAllCountriesQuery);
    const { data: billingAddressData } = useQuery(getBillingAddressQuery, {
        variables: { cartId }
    });
    const { data: shippingAddressData } = useQuery(getShippingAddressQuery, {
        variables: { cartId }
    });
    const { data: isBillingAddressSameData } = useQuery(
        getIsBillingAddressSameQuery,
        { variables: { cartId } }
    );
    const [
        updateBillingAddress,
        {
            error: billingAddressMutationErrors,
            called: billingAddressMutationCalled,
            loading: billingAddressMutationLoading
        }
    ] = useMutation(setBillingAddressMutation);
    const [
        updateCCDetails,
        {
            error: ccMutationErrors,
            called: ccMutationCalled,
            loading: ccMutationLoading
        }
    ] = useMutation(setCreditCardDetailsOnCartMutation);

    const shippingAddressCountry = shippingAddressData
        ? shippingAddressData.cart.shippingAddresses[0].country.code
        : 'US';
    const { countries } = countriesData || {};
    const isBillingAddressSame = formState.values.isBillingAddressSame;

    const initialValues = useMemo(() => {
        const isBillingAddressSame = isBillingAddressSameData
            ? isBillingAddressSameData.cart.isBillingAddressSame
            : true;

        let billingAddress = {};
        /**
         * If billing address is same as shipping address, do
         * not auto fill the fields.
         */
        if (billingAddressData && !isBillingAddressSame) {
            if (billingAddressData.cart.billingAddress) {
                const {
                    // eslint-disable-next-line no-unused-vars
                    __typename,
                    ...rawBillingAddress
                } = billingAddressData.cart.billingAddress;
                billingAddress = mapAddressData(rawBillingAddress);
            }
        }

        return { isBillingAddressSame, ...billingAddress };
    }, [isBillingAddressSameData, billingAddressData]);

    const errors = useMemo(() => {
        const errors = [];

        if (ccMutationErrors) {
            ccMutationErrors.graphQLErrors.forEach(({ message }) => {
                errors.push(message);
            });
        }
        if (billingAddressMutationErrors) {
            billingAddressMutationErrors.graphQLErrors.forEach(
                ({ message }) => {
                    errors.push(message);
                }
            );
        }

        return errors;
    }, [ccMutationErrors, billingAddressMutationErrors]);

    /**
     * Helpers
     */

    const setIsBillingAddressSameInCache = useCallback(() => {
        client.writeQuery({
            query: getIsBillingAddressSameQuery,
            data: {
                cart: {
                    __typename: 'Cart',
                    id: cartId,
                    isBillingAddressSame
                }
            }
        });
    }, [client, cartId, getIsBillingAddressSameQuery, isBillingAddressSame]);

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

    const setBillingAddress = useCallback(() => {
        const {
            firstName,
            lastName,
            country,
            street1,
            street2,
            city,
            state,
            postalCode,
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
                state,
                postalCode,
                phoneNumber,
                sameAsShipping: false
            }
        });
    }, [formState.values, updateBillingAddress, cartId]);

    const setPaymentDetailsInCache = useCallback(
        paymentNonce => {
            /**
             * We dont save the nonce due to PII
             */
            const { details, description, type } = paymentNonce;
            client.writeQuery({
                query: getPaymentNonceQuery,
                data: {
                    cart: {
                        __typename: 'Cart',
                        id: cartId,
                        paymentNonce: {
                            details,
                            description,
                            type
                        }
                    }
                }
            });
        },
        [cartId, client, getPaymentNonceQuery]
    );

    const updateCCDetailsOnCart = useCallback(
        braintreeNonce => {
            const { nonce } = braintreeNonce;
            updateCCDetails({
                variables: {
                    cartId,
                    paymentMethod: 'braintree',
                    paymentNonce: nonce
                }
            });
        },
        [updateCCDetails, cartId]
    );

    const onPaymentSuccess = useCallback(
        nonce => {
            setPaymentDetailsInCache(nonce);
            /**
             * Updating payment nonce and selected payment method on cart.
             */
            updateCCDetailsOnCart(nonce);
            setStepNumber(5);
        },
        [setPaymentDetailsInCache, updateCCDetailsOnCart]
    );

    const onPaymentError = useCallback(
        error => {
            setStepNumber(0);
            if (onError) {
                onError(error);
            }
        },
        [onError]
    );

    const onPaymentReady = useCallback(() => {
        setDropinLoading(false);
        setStepNumber(0);
        if (onReady) {
            onReady();
        }
    }, [onReady]);

    /**
     * Effects
     */

    /**
     * Step 1 effect
     *
     * User has clicked the update button
     */
    useEffect(() => {
        if (shouldSubmit) {
            if (isBillingAddressSame) {
                setShippingAddressAsBillingAddress();
            } else {
                setBillingAddress();
            }
            setStepNumber(1);
            setIsBillingAddressSameInCache();
        }
    }, [
        shouldSubmit,
        isBillingAddressSame,
        setShippingAddressAsBillingAddress,
        setBillingAddress,
        setIsBillingAddressSameInCache
    ]);

    /**
     * Step 2 effect
     *
     * Billing address mutation has completed
     */
    useEffect(() => {
        const billingAddressMutationCompleted =
            billingAddressMutationCalled && !billingAddressMutationLoading;
        if (billingAddressMutationCompleted && !billingAddressMutationErrors) {
            /**
             * Billing address save mutation is successful
             * we can initiate the braintree nonce request
             */
            setStepNumber(3);
            setShouldRequestPaymentNonce(true);
        }

        if (billingAddressMutationCompleted && billingAddressMutationErrors) {
            /**
             * Billing address save mutation is not successful.
             * Reset update button clicked flag.
             */
            setStepNumber(0);
            resetShouldSubmit();
            setShouldRequestPaymentNonce(false);
        }
    }, [
        billingAddressMutationErrors,
        billingAddressMutationCalled,
        billingAddressMutationLoading,
        resetShouldSubmit
    ]);

    /**
     * Step 3 effect
     *
     * Credit card save mutation has completed
     */
    useEffect(() => {
        /**
         * Saved billing address, payment method and payment nonce on cart.
         *
         * Time to call onSuccess.
         */
        if (ccMutationCalled && !ccMutationLoading && errors.length === 0) {
            if (onSuccess) {
                onSuccess();
            }
            resetShouldSubmit();
            setStepNumber(7);
        }

        if (ccMutationCalled && !ccMutationLoading && errors.length) {
            /**
             * If credit card mutation failed, reset update button clicked so the
             * user can click again and set `stepNumber` to 0.
             */
            setStepNumber(0);
            resetShouldSubmit();
            setShouldRequestPaymentNonce(false);
        }
    }, [
        ccMutationCalled,
        ccMutationLoading,
        errors,
        onSuccess,
        setShouldRequestPaymentNonce,
        resetShouldSubmit
    ]);

    return {
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady,
        isBillingAddressSame,
        countries,
        isDropinLoading,
        errors,
        shouldRequestPaymentNonce,
        stepNumber,
        initialValues,
        shippingAddressCountry
    };
};
