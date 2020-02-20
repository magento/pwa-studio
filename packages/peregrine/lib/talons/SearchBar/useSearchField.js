import { useCallback } from 'react';
import { useFieldState, useFormApi } from 'informed';

/**
 * Returns props necessary to render a SearchField component.
 */
export const useSearchField = () => {
    const { value } = useFieldState('search_query');
    const formApi = useFormApi();

    const resetForm = useCallback(() => {
        formApi.reset();
    }, [formApi]);

    return {
        resetForm,
        value
    };
};
