import { useCallback, useMemo } from 'react';

/**
 * Returns values used to render an AddressForm component.
 * @param {Object} props
 * @param {Object[]} props.fields an array of fields to reduce over for initial values
 * @param {Object} props.initialValues Object containing some initial values from state
 * @param {function} props.onCancel cancel callback
 * @param {function} props.onSubmit submit callback
 * @returns {{
 *   handleCancel: function,
 *   handleSubmit: function,
 *   initialValues: object
 * }}
 */
export const useAddressForm = props => {
    const { fields, initialValues, onCancel, onSubmit } = props;

    const values = useMemo(
        () =>
            fields.reduce((acc, key) => {
                acc[key] = initialValues[key];
                return acc;
            }, {}),
        [fields, initialValues]
    );

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    const handleSubmit = useCallback(
        addressFormValues => {
            onSubmit(addressFormValues);
        },
        [onSubmit]
    );

    return {
        handleCancel,
        handleSubmit,
        initialValues: values
    };
};
