import { useEffect, useRef } from 'react';
import { useFieldApi, useFieldState } from 'informed';

/**
 * The usePostcode talon handles logic for resetting the postcode field value when the country changes.
 *
 * @param {Object} props
 * @param {string} props.countryCodeField
 * @param {string} props.fieldInput - the reference field path for free form text input Defaults to "postcode".
 *
 * @return {PostcodeTalonProps}
 */
export const usePostcode = props => {
    const { countryCodeField = 'country', fieldInput = 'postcode' } = props;

    const hasInitialized = useRef(false);
    const countryFieldState = useFieldState(countryCodeField);
    const { value: country } = countryFieldState;

    const postcodeInputFieldApi = useFieldApi(fieldInput);

    // Reset postcode when country changes. Because of how Informed sets
    // initialValues, we want to skip the first state change of the value being
    // initialized.
    useEffect(() => {
        if (country) {
            if (hasInitialized.current) {
                postcodeInputFieldApi.reset();
            } else {
                hasInitialized.current = true;
            }
        }
    }, [country, postcodeInputFieldApi]);

    return {};
};

/** JSDocs type definitions */

/**
 * @typedef {Object} PostcodeTalonProps
 */
