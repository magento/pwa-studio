import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApolloClient } from '@apollo/react-hooks';

import addToCache from './addToCache';
import getRouteComponent from './getRouteComponent';

const CLIENT_PATHS = new Set().add('/search.html');
const IS_LOADING = { isLoading: true };

export const useMagentoRoute = () => {
    const [componentMap, setComponentMap] = useState(new Map());
    const { apiBase } = useApolloClient();
    const { pathname } = useLocation();

    const routeData = componentMap.get(pathname);

    // ask Magento for a RootComponent that matches the current pathname
    useEffect(() => {
        const isKnown = componentMap.has(pathname);
        const isClientOnly = CLIENT_PATHS.has(pathname);

        // avoid asking if we already know the answer
        if (!isKnown && !isClientOnly) {
            getRouteComponent(apiBase, pathname).then(
                ({ component, id, pathname, routeError }) => {
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

    return routeData || IS_LOADING;
};
