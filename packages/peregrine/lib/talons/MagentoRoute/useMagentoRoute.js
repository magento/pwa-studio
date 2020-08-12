import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApolloClient } from '@apollo/react-hooks';

import addToCache from './addToCache';
import getRouteComponent from './getRouteComponent';

const CODE_PERMANENT_REDIRECT = 301;
const CODE_TEMPORARY_REDIRECT = 302;
const REDIRECT_CODES = [CODE_PERMANENT_REDIRECT, CODE_TEMPORARY_REDIRECT];

// The talon returns a consistent data shape.
// These objects and functions help enforce that shape.
const talonResults = {
    ERROR: routeError => ({
        component: null,
        id: null,
        isLoading: false,
        routeError
    }),
    LOADING: {
        component: null,
        id: null,
        isLoading: true,
        routeError: null
    },
    SUCCESS: (component, id) => ({
        component,
        id,
        isLoading: false,
        routeError: null
    })
};

/**
 *  The useMagentoRoute talon assists the MagentoRoute component by maintaining
 *  internal state of route paths to RootComponents.
 *
 *  @returns {Object}           talonProps
 *  @returns {React.Component}  talonProps.component - the RootComponent that matches this path.
 *  @returns {Number}           talonProps.id - the id of the Component.
 *  @returns {Boolean}          talonProps.isLoading - whether the RootComponent is loading.
 *  @returns {Error}            talonProps.routeError - An error object if one arises.
 */
export const useMagentoRoute = () => {
    const [componentMap, setComponentMap] = useState(new Map());
    const { apiBase } = useApolloClient();
    const { pathname } = useLocation();
    const isMountedRef = useRef(false);

    // Keep track of whether we are mounted or not.
    // Note that this component never unmounts.
    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Update the componentMap data in local state
    // by asking Magento for a RootComponent that matches the path.
    useEffect(() => {
        // Avoid setting state if unmounted.
        if (!isMountedRef.current) {
            return;
        }

        const cacheRouteData = (pathname, data) => {
            // Add the pathname to the browser cache.
            addToCache(pathname);

            const { component, id, routeError } = data;

            // Save the results of this call to local state.
            setComponentMap(prevMap => {
                const nextMap = new Map(prevMap);
                const nextValue = routeError
                    ? talonResults.ERROR(routeError)
                    : talonResults.SUCCESS(component, id);

                return nextMap.set(pathname, nextValue);
            });
        };

        const fetchRouteData = async pathname => {
            const localRouteData = componentMap.get(pathname);

            // If we don't have any local data for this path, get it.
            if (!localRouteData) {
                const newRouteData = await getRouteComponent(apiBase, pathname);
                cacheRouteData(pathname, newRouteData);
                return newRouteData;
            }

            // We have route data, but it may be a failure response.
            // If we're online, ask again to see if we can get the real data.
            const { id } = localRouteData;
            const isNotFound = id === -1;
            if (isNotFound && navigator.onLine) {
                const retryRouteData = await getRouteComponent(
                    apiBase,
                    pathname
                );
                cacheRouteData(pathname, retryRouteData);
                return retryRouteData;
            }

            // We have good local data, return it.
            // (Or we have a 'not found' response but we're offline.)
            return localRouteData;
        };

        const fetchAndUpdateWithRedirects = async () => {
            const pathnamesExamined = new Set();
            let isRedirect = true;
            let currentPathname = pathname;

            // Allow for the possibility that redirects may be chained.
            while (isRedirect) {
                // Avoid circular redirects which will result in infinite loops.
                if (pathnamesExamined.has(currentPathname)) {
                    break;
                }

                const routeInfo = await fetchRouteData(currentPathname);
                pathnamesExamined.add(currentPathname);
                const { redirectCode: routeCode, relativeUrl } = routeInfo;

                currentPathname = relativeUrl;
                isRedirect = REDIRECT_CODES.includes(routeCode);
            }
        };

        fetchAndUpdateWithRedirects();
    }, [apiBase, componentMap, pathname]);

    // The componentMap can be updated as a side effect. See the `useEffect` above.
    const routeData = componentMap.get(pathname) || talonResults.LOADING;

    return routeData;
};
