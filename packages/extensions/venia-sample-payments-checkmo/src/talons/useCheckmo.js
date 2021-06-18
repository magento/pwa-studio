import { useCallback, useEffect, useMemo } from 'react';
import { useApolloClient, useQuery, useMutation } from '@apollo/client';
import { useFormState, useFormApi } from 'informed';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import DEFAULT_OPERATIONS from './checkmo.gql';

/**
 * Maps address response data from GET_BILLING_ADDRESS and GET_SHIPPING_ADDRESS
 * queries to input names in the billing address form.
 * {@link checkmo.gql.js}.
 *
 * @param {ShippingCartAddress|BillingCartAddress} rawAddressData query data
 */
export const mapAddressData = rawAddressData => {
    if (!rawAddressData) return {};

    const {
        firstName,
        lastName,
        city,
        postcode,
        phoneNumber,
        street,
        country,
        region
    } = rawAddressData;

    return {
        firstName,
        lastName,
        city,
        postcode,
        phoneNumber,
        street1: street[0],
        street2: street[1],
        country: country.code,
        region: region.region_id
    };
};

/**
 * Talon to handle checkmo payment.
 *
 * @param {Boolean} props.shouldSubmit boolean value which represents if a payment nonce request has been submitted
 * @param {Function} props.onPaymentSuccess callback to invoke when the a payment nonce has been generated
 * @param {Function} props.onPaymentError callback to invoke when component throws an error
 * @param {Function} props.resetShouldSubmit callback to reset the shouldSubmit flag
 * @param {DocumentNode} props.operations.getCheckmoConfigQuery query to fetch config from backend
 * @param {DocumentNode} props.operations.setPaymentMethodOnCartMutation mutation to set checkmo as payment
 *
 * @returns {
 *  payableTo: String,
 *  mailingAddress: String,
 *  onBillingAddressChangedError: Function,
 *  onBillingAddressChangedSuccess: Function
 * }
 */
export const useCheckmo = props => {
    const {
        mailingAddress: propsMailingAddress,
        resetShouldSubmit,
        onPaymentSuccess,
        onPaymentError,
        shouldSubmit
    } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        getIsBillingAddressSameQuery,
        getCheckmoConfigQuery,
        getBillingAddressQuery,
        getShippingAddressQuery,
        setBillingAddressMutation,
        setPaymentMethodOnCartMutation
    } = operations;

    const client = useApolloClient();
    const [{ cartId }] = useCartContext();
    const formState = useFormState();
    const { validate: validateBillingAddressForm } = useFormApi();
    const { data } = useQuery(getCheckmoConfigQuery);

    const { data: isBillingAddressSameData } = useQuery(
        getIsBillingAddressSameQuery,
        { skip: !cartId, variables: { cartId } }
    );
    const { data: billingAddressData } = useQuery(getBillingAddressQuery, {
        skip: !cartId,
        variables: { cartId }
    });
    const { data: shippingAddressData } = useQuery(getShippingAddressQuery, {
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
        setPaymentMethod,
        {
            error: paymentMethodMutationError,
            called: paymentMethodMutationCalled,
            loading: paymentMethodMutationLoading
        }
    ] = useMutation(setPaymentMethodOnCartMutation);

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

    const errors = useMemo(() => new Map([]), []);

    /*
     * Derived State.
     */
    const configuredMailingAddress =
        data &&
        data.storeConfig &&
        data.storeConfig.payment_checkmo_mailing_address;
    const mailingAddress = configuredMailingAddress
        ? configuredMailingAddress
        : propsMailingAddress;

    const shippingAddressCountry = shippingAddressData
        ? shippingAddressData.cart.shippingAddresses[0].country.code
        : DEFAULT_COUNTRY_CODE;

    const isBillingAddressSame = formState.values.isBillingAddressSame;

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
                    isBillingAddressSame
                }
            }
        });
    }, [client, cartId, getIsBillingAddressSameQuery, isBillingAddressSame]);

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
                region: region.region_id,
                postcode,
                phoneNumber,
                sameAsShipping: false
            }
        });
    }, [formState.values, updateBillingAddress, cartId]);

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

    /**
     * This function saves the payment method to the cart.
     */
    const setPaymentMethodOnCart = useCallback(() => {
        setPaymentMethod({ variables: { cartId } });
    }, [cartId, setPaymentMethod]);

    /*
     *  Effects.
     */

    useEffect(() => {
        if (!shouldSubmit) {
            console.log('Effect fired but we should not submit');
            return;
        }

        try {
            // Validate the form.
            validateBillingAddressForm();
            const hasErrors = Object.keys(formState.errors).length;
            if (hasErrors) {
                throw new Error('Errors in the billing address form');
            }

            // Set the billing address.
            setIsBillingAddressSameInCache();
            if (isBillingAddressSame) {
                setShippingAddressAsBillingAddress();
            } else {
                setBillingAddress();
            }

            // Set the payment method.
            setPaymentMethodOnCart();
        } catch (e) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(err);
            }
            resetShouldSubmit();
        }
    }, [
        formState.errors,
        isBillingAddressSame,
        resetShouldSubmit,
        setBillingAddress,
        setIsBillingAddressSameInCache,
        setPaymentMethodOnCart,
        shouldSubmit,
        validateBillingAddressForm
    ]);

    useEffect(() => {
        const paymentMethodMutationCompleted =
            paymentMethodMutationCalled && !paymentMethodMutationLoading;

        if (paymentMethodMutationCompleted && !paymentMethodMutationError) {
            resetShouldSubmit();
            onPaymentSuccess();
        }

        if (paymentMethodMutationCompleted && paymentMethodMutationError) {
            resetShouldSubmit();
            onPaymentError();
        }
    }, [
        paymentMethodMutationError,
        paymentMethodMutationLoading,
        paymentMethodMutationCalled,
        onPaymentSuccess,
        onPaymentError,
        resetShouldSubmit
    ]);

    return {
        errors,
        initialValues,
        isBillingAddressSame,
        mailingAddress,
        payableTo:
            data &&
            data.storeConfig &&
            data.storeConfig.payment_checkmo_payable_to,
        shippingAddressCountry
    };
};
