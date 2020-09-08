import { useCallback, useEffect, useRef } from 'react';
import { useFieldState, useFormApi } from 'informed';

/**
 * Returns props necessary to render a SearchField component.
 */
export const useSearchField = props => {
    const { isSearchOpen } = props;
    const inputRef = useRef();

    const { value } = useFieldState('search_query');
    const formApi = useFormApi();

    const resetForm = useCallback(() => {
        formApi.reset();
    }, [formApi]);

    // When the search field is opened focus on the input.
    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isSearchOpen]);

    return {
        inputRef,
        resetForm,
        value
    };
};
