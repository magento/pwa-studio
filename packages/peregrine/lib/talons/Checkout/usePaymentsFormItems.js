import { useCallback, useState } from 'react';
import { useFormState } from 'informed';

/**
 *
 * @param {boolean} props.isSubmitting whether or not the payment form items are
 * @param {function} props.setIsSubmitting callback for setting submitting state
 * @param {function} props.onSubmit submit callback
 */
export const usePaymentsFormItems = props => {
    const [isReady, setIsReady] = useState(false);
    const { isSubmitting, setIsSubmitting, onCancel, onSubmit } = props;

    // Currently form state toggles dirty from false to true because of how
    // informed is implemented. This effectively causes this child components
    // to re-render multiple times. Keep tabs on the following issue:
    //   https://github.com/joepuzzo/informed/issues/138
    // If they resolve it or we move away from informed we can probably get some
    // extra performance.
    const formState = useFormState();
    const addressDiffers = formState.values.addresses_same === false;

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    const handleError = useCallback(() => {
        setIsSubmitting(false);
    }, [setIsSubmitting]);

    // The success callback. Unfortunately since form state is created first and
    // then modified when using initialValues any component who uses this
    // callback will be rendered multiple times on first render. See above
    // comments for more info.
    const handleSuccess = useCallback(
        value => {
            setIsSubmitting(false);
            const sameAsShippingAddress = formState.values['addresses_same'];
            let billingAddress;
            if (!sameAsShippingAddress) {
                billingAddress = {
                    city: formState.values['city'],
                    email: formState.values['email'],
                    firstname: formState.values['firstname'],
                    lastname: formState.values['lastname'],
                    postcode: formState.values['postcode'],
                    region_code: formState.values['region_code'],
                    street: formState.values['street'],
                    telephone: formState.values['telephone']
                };
            } else {
                billingAddress = {
                    sameAsShippingAddress
                };
            }
            onSubmit({
                billingAddress,
                paymentMethod: {
                    code: 'braintree',
                    data: value
                }
            });
        },
        [formState.values, setIsSubmitting, onSubmit]
    );

    return {
        addressDiffers,
        handleCancel,
        handleError,
        handleSuccess,
        isDisabled: !isReady || isSubmitting,
        setIsReady
    };
};
