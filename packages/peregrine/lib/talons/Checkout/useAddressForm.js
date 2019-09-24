import { useMemo } from 'react';

/**
 * Returns values used to render an AddressForm component.
 * @param {Object} props
 * @param {Object} props.fields an array of fields to reduce over for initial values
 * @param {Object} props... TODO complete these
 */
export const useAddressForm = props => {
    const {
        onCancel,
        countries,
        fields,
        initialValues,
        isSubmitting,
        error,
        onSubmit
    } = props;

    const values = useMemo(
        () =>
            fields.reduce((acc, key) => {
                acc[key] = initialValues[key];
                return acc;
            }, {}),
        [fields, initialValues]
    );

    return {
        countries,
        error,
        handleCancel: onCancel,
        handleSubmit: onSubmit,
        initialValues: values,
        isSubmitting
    };
};
