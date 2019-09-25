import { useMemo } from 'react';

/**
 * Returns values used to render an AddressForm component.
 * @param {Object} props
 * @param {Object[]} props.fields an array of fields to reduce over for initial values
 * @param {Object} props.initialValues Object containing some initial values from state
 * @returns {Object} initialValues a map of form fields and corresponding initial values.
 */
export const useAddressForm = props => {
    const { fields, initialValues } = props;

    const values = useMemo(
        () =>
            fields.reduce((acc, key) => {
                acc[key] = initialValues[key];
                return acc;
            }, {}),
        [fields, initialValues]
    );

    return {
        initialValues: values
    };
};
