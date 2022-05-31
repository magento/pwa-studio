import { useEffect } from 'react';
import { useQuery } from '@apollo/client';

import mergeOperations from '../../util/shallowMerge';
import { useAppContext } from '../../context/app';
import { useEventingContext } from '../../context/eventing';

import DEFAULT_OPERATIONS from './cmsPage.gql';

/**
 * Retrieves data necessary to render a CMS Page
 *
 * @param {{identifier}} props
 * @param {String} props.identifier - CMS Page Identifier
 * @param {Object} props.operations - Collection of GraphQL queries
 * @returns {{cmsPage: *, shouldShowLoadingIndicator: *}}
 */
export const useCmsPage = props => {
    const { identifier } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCMSPageQuery } = operations;
    const [, { dispatch }] = useEventingContext();

    const { loading, data } = useQuery(getCMSPageQuery, {
        variables: {
            identifier: identifier
        },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    // To prevent loading indicator from getting stuck, unset on unmount.
    useEffect(() => {
        return () => {
            setPageLoading(false);
        };
    }, [setPageLoading]);

    // Ensure we mark the page as loading while we check the network for updates
    useEffect(() => {
        setPageLoading(loading);
    }, [loading, setPageLoading]);

    const shouldShowLoadingIndicator = loading && !data;

    const cmsPage = data ? data.cmsPage : null;

    useEffect(() => {
        if (!loading && cmsPage) {
            dispatch({
                type: 'CMS_PAGE_VIEW',
                payload: {
                    url_key: cmsPage.url_key,
                    title: cmsPage.title
                }
            });
        }
    }, [loading, cmsPage, dispatch]);

    return {
        cmsPage,
        shouldShowLoadingIndicator
    };
};
