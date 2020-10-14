import { useEffect, useRef } from 'react';
import { useFieldApi, useFieldState } from 'informed';

export const usePostcode = props => {
    const { countryCodeField = 'country', fieldInput } = props;

    const hasInitialized = useRef(false);
    const countryFieldState = useFieldState(countryCodeField);
    const { value: country } = countryFieldState;

    const postcodeInputFieldApi = useFieldApi(fieldInput);

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
