import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import getRouteComponent from './getRouteComponent';
import DEFAULT_OPERATIONS from './magentoRoute.gql';

export const useMagentoRoute = (props = {}) => {
    const { operations = DEFAULT_OPERATIONS } = props;
    const history = useHistory();
    const { pathname } = useLocation();
    const isMountedRef = useRef(false);
    const [responses, setResponses] = useState(new Map());
    const { getStoreCodeQuery, resolveUrlQuery } = operations;

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const storeCodeResult = useQuery(getStoreCodeQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const { data: storeCodeData } = storeCodeResult;
    const store = storeCodeData && storeCodeData.storeConfig.code;
    const routeKey = getRouteKey(pathname, store);
    const routeData = responses.get(routeKey);

    const urlResult = useQuery(resolveUrlQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: { url: pathname }
    });

    // fetch a component if necessary
    useEffect(() => {
        const { data, error, loading } = urlResult;

        // exit if we've unmounted, or if we don't have data
        if (!isMountedRef.current || loading || !data || !store) return;

        // the result may be null or incomplete, amounting to a 404
        const { urlResolver } = data;
        const { id, redirectCode, relative_url, type } = urlResolver || {};
        const isNotFound = !urlResolver || !id || !type || id === -1;
        const isRedirect = REDIRECT_CODES.has(redirectCode);

        getRouteComponent(type, id)
            .then(component => {
                // throw Apollo errors to the catch block
                if (error) throw error;

                return isNotFound
                    ? talonResponses.NOT_FOUND
                    : isRedirect
                    ? talonResponses.REDIRECT(relative_url)
                    : talonResponses.FOUND(component, id, type);
            })
            .catch(error => {
                // catch errors from url resolution and component fetching
                return talonResponses.ERROR(error);
            })
            .then(nextValue => {
                if (!isMountedRef.current || !nextValue) return;

                // set the response in state, even if it's an error
                setResponses(prevMap =>
                    new Map(prevMap).set(
                        getRouteKey(pathname, store),
                        nextValue
                    )
                );
            });
    }, [pathname, setResponses, store, urlResult]);

    // perform a redirect if necesssary
    useEffect(() => {
        if (routeData && routeData.isRedirect) {
            history.replace(routeData.relativeUrl);
        }
    }, [history, pathname, routeData]);

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
