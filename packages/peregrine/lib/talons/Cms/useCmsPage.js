import { useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';

import mergeOperations from '../../util/shallowMerge';
import { useAppContext } from '../../context/app';

import DEFAULT_OPERATIONS from './cmsPage.gql';

/**
 * Retrieves data necessary to render a CMS Page
 *
 * @param {{identifier}} props
 * @param {String} props.identifier - CMS Page Identifier
 * @param {Object} props.operations - Collection of GraphQL queries
 * @returns {{shouldShowLoadingIndicator: *, hasContent: *, cmsPage: *, error: *}}
 */
export const useCmsPage = props => {
    const { identifier } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCMSPageQuery } = operations;

    const { loading, error, data } = useQuery(getCMSPageQuery, {
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
    const rootCategoryId = data ? data.storeConfig.root_category_id : null;

    return {
        cmsPage,
        error,
        rootCategoryId,
        shouldShowLoadingIndicator
    };
};
