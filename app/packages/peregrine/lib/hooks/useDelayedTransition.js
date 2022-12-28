import { useEffect, useRef } from 'react';
import { matchPath } from 'react-router';
import { useHistory, useLocation } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';

import { availableRoutes } from '@magento/venia-ui/lib/components/Routes/routes';

import { useAppContext } from '../context/app';
import { useRootComponents } from '../context/rootComponents';
import mergeOperations from '../util/shallowMerge';
import { getComponentData } from '../util/magentoRouteData';
import DEFAULT_OPERATIONS from '../talons/MagentoRoute/magentoRoute.gql';
import { getRootComponent } from '../talons/MagentoRoute/helpers';

const DELAY_MESSAGE_PREFIX = 'DELAY:';

const useDelayedTransition = () => {
    const { pathname } = useLocation();
    const history = useHistory();
    const client = useApolloClient();
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { resolveUrlQuery } = operations;
    const [, setComponentMap] = useRootComponents();
    const [, appApi] = useAppContext();
    const { actions: appActions } = appApi;
    const { setPageLoading } = appActions;
    const unblock = useRef();

    useEffect(() => {
        // Override globalThis.addEventListener to prevent binding beforeunload while we add our blocker
        const originalWindowAddEventListener = globalThis.addEventListener;
        globalThis.addEventListener = (type, listener, options) => {
            if (type === 'beforeunload') {
                return;
            }

            if (typeof originalWindowAddEventListener === 'function') {
                return originalWindowAddEventListener(type, listener, options);
            }
        };

        unblock.current = history.block(location => {
            let currentPath = pathname;

            if (process.env.USE_STORE_CODE_IN_URL === 'true') {
                const storeCodes = AVAILABLE_STORE_VIEWS.map(
                    store => `\/?${store.store_code}`
                ).join('|');
                const regex = new RegExp(`^${storeCodes}`);
                currentPath = currentPath.replace(regex, '');
            }

            // Ignore query string changes
            if (location.pathname === currentPath) {
                return true;
            }

            // Ignore hardcoded routes
            const isInternalRoute = availableRoutes.some(
                ({ pattern: path, exact }) => {
                    return !!matchPath(location.pathname, {
                        path,
                        exact
                    });
                }
            );
            if (isInternalRoute) {
                return true;
            }

            return `${DELAY_MESSAGE_PREFIX}${location.pathname}`;
        });

        globalThis.addEventListener = originalWindowAddEventListener;

        return () => {
            if (typeof unblock.current === 'function') {
                unblock.current();
            }
        };
    }, [pathname, history]);

    useEffect(() => {
        globalThis.handleRouteChangeConfirmation = async (message, proceed) => {
            if (globalThis.avoidDelayedTransition) {
                globalThis.avoidDelayedTransition = false;
                if (typeof unblock.current === 'function') {
                    unblock.current();
                }
                return proceed(true);
            }

            setPageLoading(true);
            const currentPathname = message.replace(DELAY_MESSAGE_PREFIX, '');

            const queryResult = await client.query({
                query: resolveUrlQuery,
                fetchPolicy: 'cache-first',
                nextFetchPolicy: 'cache-first',
                variables: { url: currentPathname }
            });

            const { data } = queryResult;
            const { route } = data || {};
            const { type, ...routeData } = route || {};

            if (type) {
                const rootComponent = await getRootComponent(type);
                setComponentMap(prevMap =>
                    new Map(prevMap).set(currentPathname, {
                        component: rootComponent,
                        ...getComponentData(routeData),
                        type
                    })
                );
            }

            setPageLoading(false);
            if (typeof unblock.current === 'function') {
                unblock.current();
            }
            proceed(true);
        };
    }, [client, resolveUrlQuery, setComponentMap, setPageLoading]);
};

export default useDelayedTransition;
