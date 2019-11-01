import { useCallback, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useHistory, useLocation } from 'react-router-dom';

import getQueryParameterValue from '../../util/getQueryParameterValue';

/**
 * Return props necessary to render a SearchPage component.
 *
 * @param {Object} props
 * @param {String} props.query - graphql query used for executing search
 */
export const useSearchPage = props => {
    const { query } = props;

    const history = useHistory();
    const location = useLocation();

    // retrieve app state and action creators
    const [appState, appApi] = useAppContext();
    const { searchOpen } = appState;
    const { executeSearch, toggleDrawer, toggleSearch } = appApi;

    const openDrawer = useCallback(() => {
        toggleDrawer('filter');
    }, [toggleDrawer]);

    // get the URL query parameters.
    const urlQueryValue = getQueryParameterValue({
        location,
        queryParameter: 'query'
    });
    const categoryId = getQueryParameterValue({
        location,
        queryParameter: 'category'
    });

    // derive initial state from query params
    // never re-run this effect, even if deps change
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        // ensure search is open to begin with
        if (toggleSearch && !searchOpen && urlQueryValue) {
            toggleSearch();
        }
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */

    const apolloQueryVariable = categoryId
        ? { inputText: urlQueryValue, categoryId }
        : { inputText: urlQueryValue };

    const { loading, error, data } = useQuery(query, {
        variables: apolloQueryVariable
    });

    return {
        loading,
        error,
        data,
        executeSearch,
        categoryId,
        openDrawer,
        history,
        location
    };
};
