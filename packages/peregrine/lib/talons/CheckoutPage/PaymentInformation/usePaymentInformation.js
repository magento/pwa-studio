import { useState, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useFieldState } from 'informed';

import { useAppContext } from '../../../context/app';
import { useCartContext } from '../../../context/cart';

/**
 *
 * @param {Function} props.onSave callback to be called when user clicks review order button
 * @param {DocumentNode} props.queries.getPaymentNonceQuery query to get the payment nonce from cache
 * @param {DocumentNode} props.queries.getCheckoutStepQuery query to get the current checkout page step
 *
 * @returns {
 *   doneEditing: Boolean,
 *   shouldRequestPaymentNonce: Boolean,
 *   isEditModalHidden: Boolean,
 *   paymentNonce: {
 *      type: String,
 *      description: String,
 *      details: {
 *          cardType: String,
 *          lastFour: String,
 *          lastTwo: String
 *      },
 *   },
 *   handleReviewOrder: Function,
 *   showEditModal: Function,
 *   hideEditModal: Function,
 *   handlePaymentError: Function,
 *   handlePaymentSuccess: Function,
 *   currentSelectedPaymentMethod: String
 *
 * }
 */
export const usePaymentInformation = props => {
    const { queries, onSave } = props;
    const { getPaymentNonceQuery, getCheckoutStepQuery } = queries;

    /**
     * Definitions
     */

    const [shouldRequestPaymentNonce, setShouldRequestPaymentNonce] = useState(
        false
    );
    const [isEditModalHidden, setIsEditModalHidden] = useState(true);
    const [, { toggleDrawer, closeDrawer }] = useAppContext();
    const [{ cartId }] = useCartContext();
    const { value: currentSelectedPaymentMethod } = useFieldState(
        'selectedPaymentMethod'
    );

    /**
     * Query Fetches
     */

    const { data: paymentNonceData } = useQuery(getPaymentNonceQuery, {
        variables: {
            cartId
        }
    });

    const paymentNonce = paymentNonceData
        ? paymentNonceData.cart.paymentNonce
        : null;

    const { data: checkoutStepData } = useQuery(getCheckoutStepQuery, {
        variables: cartId
    });

    const checkoutStep = checkoutStepData
        ? checkoutStepData.cart.checkoutStep
        : 1;

    /**
     * Helper Functions
     */

    const handleReviewOrder = useCallback(() => {
        setShouldRequestPaymentNonce(true);
    }, []);

    const showEditModal = useCallback(() => {
        toggleDrawer('edit.payment');
        setIsEditModalHidden(false);
    }, [setIsEditModalHidden, toggleDrawer]);

    const hideEditModal = useCallback(() => {
        setIsEditModalHidden(true);
        closeDrawer('edit.payment');
    }, [setIsEditModalHidden, closeDrawer]);

    const handlePaymentSuccess = useCallback(() => {
        if (onSave) {
            onSave();
        }
    }, [onSave]);

    const handlePaymentError = useCallback(() => {
        setShouldRequestPaymentNonce(false);
    }, []);

    return {
        doneEditing: checkoutStep > 3,
        checkoutStep,
        handleReviewOrder,
        shouldRequestPaymentNonce,
        paymentNonce,
        isEditModalHidden,
        showEditModal,
        hideEditModal,
        handlePaymentSuccess,
        handlePaymentError,
        currentSelectedPaymentMethod
    };
};
