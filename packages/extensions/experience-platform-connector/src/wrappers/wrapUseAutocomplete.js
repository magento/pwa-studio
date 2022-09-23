import { useEffect } from 'react';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';

// Wrapper for the useAutocomplete() talon
const wrapUseAutocomplete = useAutocomplete => {
    return props => {
        const talonProps = useAutocomplete(props);
        const [, { dispatch }] = useEventingContext();

        const {
            categories,
            displayResult,
            messageType,
            value,
            ...restProps
        } = talonProps;

        useEffect(() => {
            if (
                messageType === 'RESULT_SUMMARY' ||
                messageType === 'EMPTY_RESULT'
            ) {
                dispatch({
                    type: 'SEARCH_RESPONSE',
                    payload: {
                        categories: categories || [],
                        facets: [],
                        page: 1,
                        perPage: 3, // Same value used in GQL query
                        products: displayResult || [],
                        searchRequestId: value,
                        searchUnitId: 'search-bar',
                        suggestions: displayResult || []
                    }
                });
            }
        });

        return {
            displayResult,
            messageType,
            value,
            ...restProps
        };
    };
};

export default wrapUseAutocomplete;
