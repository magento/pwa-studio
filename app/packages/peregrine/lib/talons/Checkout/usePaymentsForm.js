import { useCallback, useState } from 'react';
import isObjectEmpty from '../../util/isObjectEmpty';

const DEFAULT_FORM_VALUES = {
    addresses_same: true
};

/**
 * Returns props necessary to render a PaymentsForm component.
 *
 * @param {Object} props.initialValues initial values from state
 */
export const usePaymentsForm = props => {
    const { initialValues } = props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(() => {
        setIsSubmitting(true);
    }, [setIsSubmitting]);

    let initialFormValues;
    if (isObjectEmpty(initialValues)) {
        initialFormValues = DEFAULT_FORM_VALUES;
    } else {
        if (initialValues.sameAsShippingAddress) {
            // If the addresses are the same, don't populate any fields
            // other than the checkbox with an initial value.
            initialFormValues = {
                addresses_same: true
            };
        } else {
            // The addresses are not the same, populate the other fields.
            initialFormValues = {
                addresses_same: false,
                ...initialValues
            };
            delete initialFormValues.sameAsShippingAddress;
        }
    }

    return {
        handleSubmit,
        initialValues: initialFormValues,
        isSubmitting,
        setIsSubmitting
    };
};
