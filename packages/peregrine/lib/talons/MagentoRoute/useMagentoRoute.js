import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useApolloClient } from '@apollo/react-hooks';

import addToCache from './addToCache';
import getRouteComponent from './getRouteComponent';

const CODE_PERMANENT_REDIRECT = 301;
const CODE_TEMPORARY_REDIRECT = 302;
const REDIRECT_CODES = [CODE_PERMANENT_REDIRECT, CODE_TEMPORARY_REDIRECT];

const IS_LOADING = { isLoading: true };

export const useMagentoRoute = () => {
    const [componentMap, setComponentMap] = useState(new Map());
    const { apiBase } = useApolloClient();
    const history = useHistory();
    const { pathname } = useLocation();
    const isMountedRef = useRef(false);

    // Keep track of whether we have been mounted yet.
    // Note that we are not unmounted on page transitions.
    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // ask Magento for a RootComponent that matches the current pathname
    useEffect(() => {
        // Avoid setting state if unmounted.
        if (!isMountedRef.current) {
            return;
        }

        const shouldFetch = data => {
            // Ask if we don't have any data.
            if (!data) return true;

            // Ask again following a prior failure.
            if (data.isNotFound && navigator.onLine) {
                return true;
            }

            return false;
        };

        // Get the data for this pathname from our Map in local state.
        const routeData = componentMap.get(pathname);

        // If we have data but it's a redirect, perform the redirect.
        if (routeData && routeData.isRedirect) {
            history.push(routeData.relativeUrl);
            return;
        }

        if (shouldFetch(routeData)) {
            getRouteComponent(apiBase, pathname).then(
                ({
                    component,
                    id,
                    pathname,
                    redirectCode,
                    relativeUrl,
                    routeError
                }) => {
                    // add the pathname to the browser cache
                    addToCache(pathname);

                    // Update our Map in local state for this path.
                    setComponentMap(prevMap => {
                        const nextMap = new Map(prevMap);

                        const nextValue = routeError
                            ? { hasError: true, routeError }
                            : id === -1
                            ? { isNotFound: true }
                            : REDIRECT_CODES.includes(redirectCode)
                            ? { isRedirect: true, relativeUrl }
                            : { component, id };

                        return nextMap.set(pathname, nextValue);
                    });
                }
            );
        }
    }, [apiBase, componentMap, history, pathname]);

    const routeData = componentMap.get(pathname);

    return routeData || IS_LOADING;
};
