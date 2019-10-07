import { useCallback } from 'react';

// TODO: derive from store config when available
const getLocation = (searchValue, categoryId) => {
    // start with the current uri
    const uri = new URL('/search.html', window.location);

    // update the query params
    uri.searchParams.set('query', searchValue);
    uri.searchParams.set('category', categoryId);

    const { pathname, search } = uri;

    // return only the pieces React Router wants
    return { pathname, search };
};

/**
 * Return props necessary to render a SuggestedCategory component.
 *
 * @param {Object} props
 * @param {String} props.categoryId - category
 * @param {Function} props.onNavigate - callback to fire on link click
 * @param {String} props.searchValue - search term
 */
export const useSuggestedCategory = props => {
    const { categoryId, onNavigate, searchValue } = props;
    const destination = getLocation(searchValue, categoryId);

    const handleClick = useCallback(() => {
        if (typeof onNavigate === 'function') {
            onNavigate();
        }
    }, [onNavigate]);

    return {
        destination,
        handleClick
    };
};
