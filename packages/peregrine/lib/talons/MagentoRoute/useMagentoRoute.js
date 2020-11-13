import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import {
    REDIRECT_CODES,
    RESPONSES,
    getRootComponent,
    getRouteKey
} from './helpers';
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
    const { storeConfig } = storeCodeData || {};
    const { code: store } = storeConfig || {};
    const routeKey = getRouteKey(pathname, store);

    // destructure url result
    const { data: urlData, error: urlError } = urlResult;
    const { urlResolver } = urlData || {};
    const { id, redirectCode, relative_url, type } = urlResolver || {};

    // calculate response
    const component = componentMap.get(routeKey);
    const isEmpty = !store || !urlResolver || !type || id < 1;
    const isPending = storeCodeResult.loading || urlResult.loading;
    const isRedirect = REDIRECT_CODES.has(redirectCode);
    const fetchError = component instanceof Error && component;
    const queryError = fetchError || storeCodeError || urlError;

    const routeData =
        component && !fetchError
            ? RESPONSES.FOUND(component)
            : queryError
            ? RESPONSES.ERROR(queryError)
            : isEmpty && !isPending
            ? RESPONSES.NOT_FOUND
            : isRedirect
            ? RESPONSES.REDIRECT(relative_url)
            : RESPONSES.LOADING;

    // fetch a component if necessary
    useEffect(() => {
        (async () => {
            // don't fetch if we don't have data yet
            if (isPending || isEmpty) return;

            // don't fetch if we already have a component
            if (component && !(component instanceof Error)) return;

            try {
                const component = await getRootComponent(type);
                setComponent(routeKey, { component, id, type });
            } catch (error) {
                setComponent(routeKey, error);
            }
        })();
    }, [component, id, isEmpty, isPending, routeKey, setComponent, type]);

    // perform a redirect if necesssary
    useEffect(() => {
        if (routeData && routeData.isRedirect) {
            replace(routeData.relativeUrl);
        }
    }, [pathname, replace, routeData]);

    return routeData;
};
