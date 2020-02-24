import { useCallback, useEffect, useRef } from 'react';
import { useFieldState, useFormApi } from 'informed';

import { useAppContext } from '../../context/app';
/**
 * Returns props necessary to render a SearchField component.
 */
export const useSearchField = () => {
    const [{ searchOpen }] = useAppContext();
    const inputRef = useRef();

    const { value } = useFieldState('search_query');
    const formApi = useFormApi();

    const resetForm = useCallback(() => {
        formApi.reset();
    }, [formApi]);

    // When the search field is opened focus on the input.
    useEffect(() => {
        if (searchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [searchOpen]);

    return {
        inputRef,
        resetForm,
        value
    };
};
