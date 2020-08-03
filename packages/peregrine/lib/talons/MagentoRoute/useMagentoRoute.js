import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLazyQuery } from '@apollo/react-hooks';

import addToCache from './addToCache';

const IS_LOADING = { isLoading: true };
export const INTERNAL_ERROR = 'INTERNAL_ERROR';
export const NOT_FOUND = 'NOT_FOUND';

// At build time, `fetchRootComponent` is injected as a global.
// Depending on the environment, this global will be either an
// ES module with a `default` property, or a plain CJS module.
const fetchRoot =
    'default' in fetchRootComponent
        ? fetchRootComponent.default
        : fetchRootComponent;

/**
 * Ask Magento for a RootComponent that matches the current pathname.
 */
export const useMagentoRoute = props => {
    const { queries } = props;
    const [componentMap, setComponentMap] = useState(new Map());
    const { pathname } = useLocation();
    const isMountedRef = useRef(false);

    const [runQuery, { data }] = useLazyQuery(queries.resolveUrl, {
        variables: {
            urlKey: pathname
        }
    });

    // First effect resolves url to component type.
    useEffect(() => {
        // avoid asking if we already know the answer
        const isKnown = componentMap.has(pathname);

        // ask again following a prior failure
        const isNotFound = isKnown && componentMap.get(pathname).id === -1;
        const shouldReload = isNotFound && navigator.onLine;

        if (!isKnown || shouldReload) {
            runQuery();
        }
    }, [componentMap, pathname, runQuery]);

    // Second query resolves root component for the type.
    useEffect(() => {
        async function getRootComponent(type, id) {
            let nextValue;
            try {
                const component = await fetchRoot(type);
                nextValue = { component, id };
            } catch (e) {
                const routeError =
                    e.message === '404' ? NOT_FOUND : INTERNAL_ERROR;

                console.error(e);

                nextValue = { hasError: true, routeError };
            } finally {
                // avoid setting state if unmounted
                if (isMountedRef.current) {
                    // add the pathname to the browser cache
                    addToCache(pathname);

                    // then add the pathname and result to local state
                    setComponentMap(prevMap => {
                        const nextMap = new Map(prevMap);
                        return nextMap.set(pathname, nextValue);
                    });
                }
            }
        }
        if (data) {
            getRootComponent(data.urlResolver.type, data.urlResolver.id);
        }
    }, [data, pathname]);

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const routeData = componentMap.get(pathname);

    return (data && routeData) || IS_LOADING;
};
