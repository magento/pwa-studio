import { useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useAppContext } from '../../context/app';

/**
 * Retrieves data necessary to render a CMS Page
 *
 * @param {object} props
 * @param {object} props.id - CMS Page ID
 * @param {object} props.queries - Collection of GraphQL queries
 * @param {object} props.queries.getCmsPage - Query for getting a CMS Page
 * @returns {{shouldShowLoadingIndicator: *, hasContent: *, cmsPage: *, error: *}}
 */
export const useCmsPage = props => {
    const {
        id,
        queries: { getCmsPage }
    } = props;

    const { loading, error, data } = useQuery(getCmsPage, {
        variables: {
            id: Number(id)
        },
        fetchPolicy: 'cache-and-network'
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

    const shouldShowLoadingIndicator = !data;

    const cmsPage = data ? data.cmsPage : null;

    // TODO: we shouldn't be validating strings to determine if the page has content or not
    const hasContent = useMemo(() => {
        return (
            cmsPage &&
            cmsPage.content &&
            cmsPage.content.length > 0 &&
            !cmsPage.content.includes('CMS homepage content goes here.')
        );
    }, [cmsPage]);

    return {
        cmsPage,
        hasContent,
        error,
        shouldShowLoadingIndicator
    };
};
