import { useCallback, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useLocation } from 'react-router-dom';

import { getSearchParam } from '../../hooks/useSearchParam';

/**
 * Return props necessary to render a SearchPage component.
 *
 * @param {Object} props
 * @param {String} props.query - graphql query used for executing search
 */
export const useSearchPage = props => {
    const { query } = props;
    const location = useLocation();

    // retrieve app state and action creators
    const [appState, appApi] = useAppContext();
    const { searchOpen } = appState;
    const { executeSearch, toggleDrawer, toggleSearch } = appApi;

    const openDrawer = useCallback(() => {
        toggleDrawer('filter');
    }, [toggleDrawer]);

    // get the URL query parameters.
    const inputText = getSearchParam('query', location);
    const categoryId = getSearchParam('category', location);

    // derive initial state from query params
    // never re-run this effect, even if deps change
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        // ensure search is open to begin with
        if (toggleSearch && !searchOpen && inputText) {
            toggleSearch();
        }
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */

    const apolloQueryVariable = categoryId
        ? { inputText, categoryId }
        : { inputText };

    const { loading, error, data } = useQuery(query, {
        variables: apolloQueryVariable
    });

    return {
        loading,
        error,
        data,
        executeSearch,
        categoryId,
        openDrawer
    };
};
