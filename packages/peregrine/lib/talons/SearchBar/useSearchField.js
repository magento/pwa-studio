import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useFieldState, useFormApi } from 'informed';

import { getSearchParam } from '../../hooks/useSearchParam';

/**
 * Returns props necessary to render a SearchField component.
 */
export const useSearchField = props => {
    const { isSearchOpen } = props;

    const inputRef = useRef();
    const { value } = useFieldState('search_query');
    const formApi = useFormApi();
    const location = useLocation();

    const resetForm = useCallback(() => {
        formApi.reset();
    }, [formApi]);

    // When the search field is opened focus on the input.
    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isSearchOpen]);

    // On the search page, seed the search input to the 'query' URL parameter.
    // We never want to re-run this effect, even if deps change.
    useEffect(() => {
        const onSearchPage = location.pathname === '/search.html';
        const urlValue = getSearchParam('query', location);

        if (onSearchPage && urlValue) {
            formApi.setValue('search_query', urlValue);
        }
    }, [formApi, location]);

    return {
        inputRef,
        resetForm,
        value
    };
};
