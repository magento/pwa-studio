import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useDropdown } from '../../hooks/useDropdown';

const initialValues = { search_query: '' };

export const useSearchBar = () => {
    const { elementRef, expanded, setExpanded } = useDropdown();
    const history = useHistory();
    const location = useLocation();
    const { push } = history;

    // expand or collapse on input change
    const handleChange = useCallback(
        value => {
            setExpanded(!!value);
        },
        [setExpanded]
    );

    // expand on focus
    const handleFocus = useCallback(() => {
        setExpanded(true);
    }, [setExpanded]);

    // navigate on submit
    const handleSubmit = useCallback(
        ({ search_query }) => {
            if (search_query != null && search_query.trim().length > 0) {
                push(`/search.html?query=${search_query}`);
            }
        },
        [push]
    );

    return {
        containerRef: elementRef,
        expanded,
        handleChange,
        handleFocus,
        handleSubmit,
        initialValues,
        location,
        setExpanded
    };
};
