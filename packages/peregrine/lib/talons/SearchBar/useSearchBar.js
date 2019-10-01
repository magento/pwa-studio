import { useCallback } from 'react';

import { useDropdown } from '../../hooks/useDropdown';

const initialValues = { search_query: '' };

export const useSearchBar = props => {
    const { history } = props;
    const { push } = history;
    const { elementRef, expanded, setExpanded } = useDropdown();

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
        setExpanded
    };
};
