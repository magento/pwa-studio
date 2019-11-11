import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApolloClient } from '@apollo/react-hooks';

import addToCache from './addToCache';
import getRouteComponent from './getRouteComponent';

const IS_LOADING = { isLoading: true };

export const useMagentoRoute = () => {
    const [componentMap, setComponentMap] = useState(new Map());
    const { apiBase } = useApolloClient();
    const { pathname } = useLocation();
    const isMountedRef = useRef(false);

    const routeData = componentMap.get(pathname);

    // ask Magento for a RootComponent that matches the current pathname
    useEffect(() => {
        // avoid asking if we already know the answer
        const isKnown = componentMap.has(pathname);

        // ask again following a prior failure
        const isNotFound = isKnown && componentMap.get(pathname).id === -1;
        const shouldReload = isNotFound && navigator.onLine;

        if (!isKnown || shouldReload) {
            getRouteComponent(apiBase, pathname).then(
                ({ component, id, pathname, routeError }) => {
                    // avoid setting state if unmounted
                    if (!isMountedRef.current) {
                        return;
                    }

                    // add the pathname to the browser cache
                    addToCache(pathname);

                    // then add the pathname and result to local state
                    setComponentMap(prevMap => {
                        const nextMap = new Map(prevMap);
                        const nextValue = routeError
                            ? { hasError: true, routeError }
                            : { component, id };

                        return nextMap.set(pathname, nextValue);
                    });
                }
            );
        }
    }, [apiBase, componentMap, pathname]);

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return routeData || IS_LOADING;
};
