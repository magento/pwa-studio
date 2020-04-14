import { useState, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useFieldState } from 'informed';

import { useAppContext } from '../../../context/app';
import { useCartContext } from '../../../context/cart';

/**
 *
 * @param {Function} props.onSave callback to be called when user clicks review order button
 * @param {Function} props.resetReviewOrderButtonClicked callback to reset the review order button flag
 * @param {DocumentNode} props.queries.getCheckoutStepQuery query to get the current checkout page step
 *
 * @returns {
 *   doneEditing: Boolean,
 *   isEditModalHidden: Boolean,
 *   showEditModal: Function,
 *   hideEditModal: Function,
 *   handlePaymentError: Function,
 *   handlePaymentSuccess: Function,
 *   currentSelectedPaymentMethod: String,
 *   checkoutStep: Number,
 *
 * }
 */
export const usePaymentInformation = props => {
    const { queries, onSave, resetReviewOrderButtonClicked } = props;
    const { getCheckoutStepQuery } = queries;

    /**
     * Definitions
     */

    const [isEditModalHidden, setIsEditModalHidden] = useState(true);
    const [, { toggleDrawer, closeDrawer }] = useAppContext();
    const [{ cartId }] = useCartContext();
    const { value: currentSelectedPaymentMethod } = useFieldState(
        'selectedPaymentMethod'
    );

    /**
     * Query Fetches
     */

    const { data: checkoutStepData } = useQuery(getCheckoutStepQuery, {
        variables: cartId
    });

    const checkoutStep = checkoutStepData
        ? checkoutStepData.cart.checkoutStep
        : 1;

    /**
     * Helper Functions
     */

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
        resetReviewOrderButtonClicked();
    }, [resetReviewOrderButtonClicked]);

    return {
        doneEditing: checkoutStep > 3,
        checkoutStep,
        isEditModalHidden,
        showEditModal,
        hideEditModal,
        handlePaymentSuccess,
        handlePaymentError,
        currentSelectedPaymentMethod
    };
};
