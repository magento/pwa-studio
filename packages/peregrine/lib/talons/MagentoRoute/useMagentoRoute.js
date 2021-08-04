import { useCallback, useEffect, useState, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { useRootComponents } from '@magento/peregrine/lib/context/rootComponents';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useAppContext } from '../../context/app';

import { getRootComponent, isRedirect } from './helpers';
import DEFAULT_OPERATIONS from './magentoRoute.gql';

const getInlinedPageData = () => {
    return globalThis.INLINED_PAGE_TYPE && globalThis.INLINED_PAGE_TYPE.type ? globalThis.INLINED_PAGE_TYPE : null;
};

export const useMagentoRoute = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { resolveUrlQuery } = operations;
    const { replace } = useHistory();
    const { pathname } = useLocation();
    const [componentMap, setComponentMap] = useRootComponents();
    const [previousPathname, setPreviousPathname] = useState(null);
    const initialized = useRef(false);

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

    const [runQuery, queryResult] = useLazyQuery(resolveUrlQuery);

    // destructure the query result
    const { data, error, loading } = queryResult;
    const { urlResolver } = data || {};
    const { id, redirectCode, relative_url, type } = urlResolver || {};

    // evaluate both results and determine the response type
    const component = componentMap.get(pathname);
    const previousComponent = previousPathname
        ? componentMap.get(previousPathname)
        : null;
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
    } else if (empty && !loading && initialized.current) {
        // NOT FOUND
        routeData = {isNotFound: true};
    } else if (nextRootComponent) {
        // LOADING with full page shimmer
        showPageLoader = true;
        routeData = { isLoading: true, shimmer: nextRootComponent };
    } else if (previousComponent && !previousFetchError) {
        // LOADING with previous component
        showPageLoader = true;
        routeData = { isLoading: true, ...previousComponent };
    } else {
        // LOADING
        const isInitialLoad = !initialized.current && getInlinedPageData();
        routeData = { isLoading: true, initial: isInitialLoad };
    }

    useEffect(() => {
        if (initialized.current) {
            runQuery({
                fetchPolicy: 'cache-and-network',
                nextFetchPolicy: 'cache-first',
                variables: { url: pathname }
            });
        }
    }, [initialized, pathname]);

    // fetch a component if necessary
    useEffect(() => {
        (async () => {
            const isInitialized = initialized.current;

            // don't fetch if we don't have data yet
            if (isInitialized && (loading || empty)) return;

            // don't fetch if we don't have inlined type
            const inlinedData = getInlinedPageData();
            if (!isInitialized && !inlinedData) return;

            // don't fetch more than once
            if (component) return;

            try {
                const componentType = isInitialized ? type : inlinedData.type;
                const rootComponent = await getRootComponent(componentType);
                setComponent(
                    pathname,
                    {
                        component: rootComponent,
                        id: isInitialized ? id : Number(inlinedData.id),
                        type: componentType
                    }
                );
            } catch (error) {
                setComponent(pathname, error);
            }
            initialized.current = true;
        })();
    }, [component, empty, id, loading, pathname, setComponent, type, initialized, getInlinedPageData]);

    // perform a redirect if necesssary
    useEffect(() => {
        if (routeData && routeData.isRedirect) {
            replace(routeData.relativeUrl);
        }
    }, [pathname, replace, routeData]);

    useEffect(() => {
        if (component) {
            // store previous component's path
            setPreviousPathname(pathname);
            // Reset loading shimmer whenever component resolves
            setNextRootComponent(null);
        }
    }, [component, pathname, setNextRootComponent, setPreviousPathname]);

    useEffect(() => {
        setPageLoading(showPageLoader);
    }, [showPageLoader, setPageLoading]);

    return routeData;
};
