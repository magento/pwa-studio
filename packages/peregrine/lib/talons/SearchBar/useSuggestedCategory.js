import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useInternalLink from '../../hooks/useInternalLink';

import { DELIMITER } from '../FilterModal/helpers';

// TODO: derive from store config when available
const setSearchParams = (existing, options) => {
    const params = new URLSearchParams(existing);
    const { categoryId, label, searchValue } = options;

    params.set('query', searchValue);
    params.set('category_id[filter]', `${label}${DELIMITER}${categoryId}`);

    return `${params}`;
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
    const { onNavigate, ...restProps } = props;
    const { createHref } = useHistory();
    const { search } = useLocation();

    const nextSearchParams = setSearchParams(search, restProps);
    const destination = createHref({
        pathname: '/search.html',
        search: nextSearchParams
    });

    const { handleClick: setLoader } = useInternalLink('category');

    const handleClick = useCallback(() => {
        if (typeof onNavigate === 'function') {
            onNavigate();
        }
        // Sets next root component to show proper loading effect
        setLoader();
    }, [onNavigate, setLoader]);

    return {
        destination,
        handleClick
    };
};
