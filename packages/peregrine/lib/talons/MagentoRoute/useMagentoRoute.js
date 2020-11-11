import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import DEFAULT_OPERATIONS from './magentoRoute.gql';

export const useMagentoRoute = (props = {}) => {
    const { operations = DEFAULT_OPERATIONS } = props;
    const { replace } = useHistory();
    const { pathname } = useLocation();
    const isMountedRef = useRef(false);
    const [componentMap, setComponentMap] = useState(new Map());
    const { getStoreCodeQuery, resolveUrlQuery } = operations;

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const setComponent = useCallback(
        (key, value) => {
            if (isMountedRef.current) {
                setComponentMap(prevMap => new Map(prevMap).set(key, value));
            }
        },
        [setComponentMap]
    );

    const getRootComponent = useMemo(() => {
        return window.fetchRootComponent.default || window.fetchRootComponent;
    }, []);

    const storeCodeResult = useQuery(getStoreCodeQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const urlResult = useQuery(resolveUrlQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: { url: pathname }
    });

    // destructure store code result
    const { data: storeCodeData, error: storeCodeError } = storeCodeResult;
    const store = storeCodeData && storeCodeData.storeConfig.code;
    const routeKey = getRouteKey(pathname, store);

    // destructure url result
    const { data: urlData, error: urlError } = urlResult;
    const { urlResolver } = urlData || {};
    const { id, redirectCode, relative_url, type } = urlResolver || {};

    // calculate response
    const isNotFound = !store || !urlResolver || !id || !type || id === -1;
    const isRedirect = REDIRECT_CODES.has(redirectCode);
    const component = componentMap.get(routeKey);
    const fetchError = component instanceof Error && component;
    const queryError = fetchError || storeCodeError || urlError;

    const routeData = queryError
        ? talonResponses.ERROR(queryError)
        : isNotFound
        ? talonResponses.NOT_FOUND
        : isRedirect
        ? talonResponses.REDIRECT(relative_url)
        : component
        ? talonResponses.FOUND(component, id, type)
        : null;

    // fetch a component if necessary
    useEffect(() => {
        (async () => {
            // don't fetch if we don't have data yet
            if (!id || !type) return;

            // don't fetch if we already have a component
            if (component && !(component instanceof Error)) return;

            try {
                const rootComponent = await getRootComponent(type);
                setComponent(routeKey, rootComponent);
            } catch (error) {
                setComponent(routeKey, error);
            }
        })();
    }, [component, getRootComponent, id, routeKey, setComponent, type]);

    // perform a redirect if necesssary
    useEffect(() => {
        if (routeData && routeData.isRedirect) {
            replace(routeData.relativeUrl);
        }
    }, [replace, pathname, routeData]);

    return routeData || talonResponses.LOADING;
};

const CODE_PERMANENT_REDIRECT = 301;
const CODE_TEMPORARY_REDIRECT = 302;
const REDIRECT_CODES = new Set()
    .add(CODE_PERMANENT_REDIRECT)
    .add(CODE_TEMPORARY_REDIRECT);

const talonResponses = {
    ERROR: routeError => ({ hasError: true, routeError }),
    LOADING: { isLoading: true },
    NOT_FOUND: { isNotFound: true },
    FOUND: (component, id, type) => ({ component, id, type }),
    REDIRECT: relativeUrl => ({ isRedirect: true, relativeUrl })
};

const getRouteKey = (pathname, store) => `[${store}]--${pathname}`;
