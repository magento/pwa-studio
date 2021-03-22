import { useCallback, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useRootComponents } from '@magento/peregrine/lib/context/rootComponents';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import { getRootComponent, isRedirect } from './helpers';
import DEFAULT_OPERATIONS from './magentoRoute.gql';

export const useMagentoRoute = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { resolveUrlQuery } = operations;
    const { replace } = useHistory();
    const { pathname } = useLocation();
    const [componentMap, setComponentMap] = useRootComponents();

    const setComponent = useCallback(
        (key, value) => {
            setComponentMap(prevMap => new Map(prevMap).set(key, value));
        },
        [setComponentMap]
    );

    const queryResult = useQuery(resolveUrlQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: { url: pathname }
    });

    // destructure the query result
    const { data, error, loading } = queryResult;
    const { urlResolver } = data || {};
    const { id, redirectCode, relative_url, type } = urlResolver || {};

    // evaluate both results and determine the response type
    const component = componentMap.get(pathname);
    const empty = !urlResolver || !type || id < 1;
    const redirect = isRedirect(redirectCode);
    const fetchError = component instanceof Error && component;
    const routeError = fetchError || error;
    let routeData;

    if (component && !fetchError) {
        // FOUND
        routeData = component;
    } else if (routeError) {
        // ERROR
        routeData = { hasError: true, routeError };
    } else if (redirect) {
        // REDIRECT
        routeData = { isRedirect: true, relativeUrl: relative_url };
    } else if (empty && !loading) {
        // NOT FOUND
        routeData = { isNotFound: true };
    } else {
        // LOADING
        routeData = { isLoading: true };
    }

    // fetch a component if necessary
    useEffect(() => {
        (async () => {
            // don't fetch if we don't have data yet
            if (loading || empty) return;

            // don't fetch more than once
            if (component) return;

            try {
                const component = await getRootComponent(type);
                setComponent(pathname, { component, id, type });
            } catch (error) {
                setComponent(pathname, error);
            }
        })();
    }, [component, empty, id, loading, pathname, setComponent, type]);

    // perform a redirect if necesssary
    useEffect(() => {
        if (routeData && routeData.isRedirect) {
            replace(routeData.relativeUrl);
        }
    }, [pathname, replace, routeData]);

    return routeData;
};
