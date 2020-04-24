import { useCallback, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useFieldState } from 'informed';

import { useAppContext } from '../../../context/app';
import { useCartContext } from '../../../context/cart';

/**
 *
 * @param {Function} props.onSave callback to be called when user clicks review order button
 * @param {Function} props.resetReviewOrderButtonClicked callback to reset the review order button flag
 * @param {DocumentNode} props.queries.getPaymentDetailsQuery query to fetch selected payment method and payment nonce details
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
    const { onSave, resetReviewOrderButtonClicked, queries } = props;
    const { getPaymentDetailsQuery } = queries;

    /**
     * Definitions
     */

    const [{ drawer }, { toggleDrawer, closeDrawer }] = useAppContext();
    const isEditModalActive = drawer === 'edit.payment';
    const { value: currentSelectedPaymentMethod } = useFieldState(
        'selectedPaymentMethod'
    );
    const [{ cartId }] = useCartContext();

    /**
     * Queries
     */

    const { data: paymentDetailsData } = useQuery(getPaymentDetailsQuery, {
        variables: { cartId }
    });

    const selectedPaymentMethodOnCart =
        paymentDetailsData && paymentDetailsData.cart.selectedPaymentMethod
            ? paymentDetailsData.cart.selectedPaymentMethod.code
            : null;
    const paymentNonceDetails = paymentDetailsData
        ? paymentDetailsData.cart.paymentNonce
        : null;

    const hasData = !!(selectedPaymentMethodOnCart && paymentNonceDetails);

    /**
     * Helper Functions
     */

    const showEditModal = useCallback(() => {
        toggleDrawer('edit.payment');
    }, [toggleDrawer]);

    const hideEditModal = useCallback(() => {
        closeDrawer('edit.payment');
    }, [closeDrawer]);

    const handlePaymentSuccess = useCallback(() => {
        if (onSave) {
            onSave();
        }
    }, [onSave]);

    const handlePaymentError = useCallback(() => {
        resetReviewOrderButtonClicked();
    }, [resetReviewOrderButtonClicked]);

    /**
     * Effects
     */

    useEffect(() => {
        /**
         * If there is a selected payment method saved on cart,
         * and paymentNonceDetails in cache, it means the payment
         * information step is completed. Call onSave to move to next step.
         *
         * Do not call if paymentNonceDetails is not in cache, because we
         * need it to render the summary. There is no way to save it on
         * the remote server, hence we save it in local cache.
         */
        if (hasData) {
            if (onSave) {
                onSave();
            }
        }
    }, [hasData, onSave]);

    return {
        doneEditing: hasData,
        isEditModalHidden: !isEditModalActive,
        showEditModal,
        hideEditModal,
        handlePaymentSuccess,
        handlePaymentError,
        currentSelectedPaymentMethod
    };
};
