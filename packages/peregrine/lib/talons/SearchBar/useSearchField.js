import { useCallback, useEffect, useRef } from 'react';
import { useFieldState, useFormApi } from 'informed';

import { getSearchParam } from '@magento/peregrine/lib/hooks/useSearchParam';

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

    // Pre-populate the search field with the search term from the URL.
    // We purposefully only ever run this effect on initial mount.
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        const urlTerm = getSearchParam('query', location);

        if (!formApi || !urlTerm) {
            return;
        }

        formApi.setValue('search_query', urlTerm);
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */

    return {
        inputRef,
        resetForm,
        value
    };
};
