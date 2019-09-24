import { useCallback, useEffect, useRef, useState } from 'react';
// TODO install informed?
import { useFormState } from 'informed';

export const usePaymentsFormItems = props => {
    const [isReady, setIsReady] = useState(false);

    const {
        onCancel,
        countries,
        isSubmitting,
        setIsSubmitting,
        onSubmit: submitPaymentData
    } = props;

    // Currently form state toggles dirty from false to true because of how
    // informed is implemented. This effectively causes this child components
    // to re-render multiple times. Keep tabs on the following issue:
    //   https://github.com/joepuzzo/informed/issues/138
    // If they resolve it or we move away from informed we can probably get some
    // extra performance.
    const formState = useFormState();
    const anchorRef = useRef(null);
    const addressDiffers = formState.values.addresses_same === false;

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
            submitPaymentData({
                billingAddress,
                paymentMethod: {
                    code: 'braintree',
                    data: value
                }
            });
        },
        [formState.values, setIsSubmitting, submitPaymentData]
    );

    // When the address checkbox is unchecked, additional fields are rendered.
    // This causes the form to grow, and potentially to overflow, so the new
    // fields may go unnoticed. To reveal them, we scroll them into view.
    useEffect(() => {
        if (addressDiffers) {
            const { current: element } = anchorRef;

            if (element instanceof HTMLElement) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [addressDiffers]);

    return {
        addressDiffers,
        anchorRef,
        countries,
        handleCancel: onCancel,
        handleError,
        handleSuccess,
        isDisabled: !isReady || isSubmitting,
        isSubmitting,
        setIsReady
    };
};
