import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useApolloClient } from '@apollo/react-hooks';

import addToCache from './addToCache';
import getRouteComponent from './getRouteComponent';

const CODE_PERMANENT_REDIRECT = 301;
const CODE_TEMPORARY_REDIRECT = 302;
const REDIRECT_CODES = [CODE_PERMANENT_REDIRECT, CODE_TEMPORARY_REDIRECT];

const talonResponses = {
    ERROR: routeError => ({ hasError: true, routeError }),
    LOADING: { isLoading: true },
    NOT_FOUND: { isNotFound: true },
    FOUND: (component, id) => ({ component, id }),
    REDIRECT: relativeUrl => ({ isRedirect: true, relativeUrl })
};

const shouldFetch = data => {
    // Should fetch if we don't have any data.
    if (!data) return true;

    // Should fetch again following a prior failure.
    if (data.isNotFound && navigator.onLine) {
        return true;
    }

    return false;
};

export const useMagentoRoute = () => {
    const [componentMap, setComponentMap] = useState(new Map());
    const { apiBase } = useApolloClient();
    const history = useHistory();
    const { pathname } = useLocation();
    const isMountedRef = useRef(false);

    const routeData = componentMap.get(pathname);

    // Keep track of whether we have been mounted yet.
    // Note that we are not unmounted on page transitions.
    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // If the entry for this pathname is a redirect, perform the redirect.
    useEffect(() => {
        if (routeData && routeData.isRedirect) {
            history.replace(routeData.relativeUrl);
        }
    }, [componentMap, history, pathname, routeData]);

    // ask Magento for a RootComponent that matches the current pathname
    useEffect(() => {
        // Avoid setting state if unmounted.
        if (!isMountedRef.current) {
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
                            ? talonResponses.ERROR(routeError)
                            : id === -1
                            ? talonResponses.NOT_FOUND
                            : REDIRECT_CODES.includes(redirectCode)
                            ? talonResponses.REDIRECT(relativeUrl)
                            : talonResponses.FOUND(component, id);

                        return nextMap.set(pathname, nextValue);
                    });
                }
            );
        }
    }, [apiBase, componentMap, history, pathname, routeData]);

    return routeData || talonResponses.LOADING;
};
