import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useRootComponents } from '@magento/peregrine/lib/context/rootComponents';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useAppContext } from '../../context/app';

import { getRootComponent, isRedirect } from './helpers';
import DEFAULT_OPERATIONS from './magentoRoute.gql';

export const useMagentoRoute = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { resolveUrlQuery } = operations;
    const { replace } = useHistory();
    const { pathname } = useLocation();
    const [componentMap, setComponentMap] = useRootComponents();
    const [previousPathname, setPreviousPathname] = useState(null);
    const [
        { nextRootComponent },
        {
            actions: { setNextRootComponent, setPageLoading }
        }
    ] = useAppContext();

    const setComponent = useCallback(
        (key, value) => {
            setComponentMap(prevMap => new Map(prevMap).set(key, value));
        },
        [setComponentMap]
    );

    const resetLoadingComponent = useCallback(() => {
        setNextRootComponent(null);
    }, [setNextRootComponent]);

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
    const previousComponent = previousPathname ? componentMap.get(previousPathname) : null;
    const empty = !urlResolver || !type || id < 1;
    const redirect = isRedirect(redirectCode);
    const fetchError = component instanceof Error && component;
    const routeError = fetchError || error;
    const previousFetchError = previousComponent instanceof Error;
    let showPageLoader = false;
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
    } else if (previousComponent && !previousFetchError) {
        showPageLoader = true;
        routeData = { isLoading: true, ...previousComponent };
    } else {
        // LOADING
        routeData = { isLoading: true, type: nextRootComponent };
    }

    // fetch a component if necessary
    useEffect(() => {
        (async () => {
            // don't fetch if we don't have data yet
            if (loading || empty) return;

            // don't fetch more than once
            if (component) return;

            try {
                const rootComponent = await getRootComponent(type);
                setComponent(pathname, { component: rootComponent, id, type });
            } catch (error) {
                setComponent(pathname, error);
            }

            resetLoadingComponent();
        })();
    }, [
        component,
        empty,
        id,
        loading,
        pathname,
        setComponent,
        setPreviousPathname,
        resetLoadingComponent,
        type
    ]);

    // perform a redirect if necesssary
    useEffect(() => {
        if (routeData && routeData.isRedirect) {
            replace(routeData.relativeUrl);
        }
    }, [pathname, replace, routeData]);

    useEffect(() => {
        if (component) {
            // Store pathname after component has changed
            setPreviousPathname(pathname);
        }
    }, [component]);

    useEffect(() => {
        setPageLoading(showPageLoader);
    }, [showPageLoader])

    return routeData;
};
