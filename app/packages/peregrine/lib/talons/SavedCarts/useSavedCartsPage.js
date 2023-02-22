import { useHistory } from 'react-router-dom';
import { useMemo, useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';

import DEFAULT_OPERATIONS from './savedCarts.gql';
import mergeOperations from '../../util/shallowMerge';

const DEFAULT_CURRENT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_TOTAL_PAGE = 0;

export const useSavedCartsPage = () => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getConfigDetailsForSavedCartsQuery, getSavedCartsQuery } = operations;

    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [carts, setCarts] = useState([]);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
    const [totalPage, setTotalPage] = useState(DEFAULT_TOTAL_PAGE);
    const [showCopyUrl, setShowCopyUrl] = useState(false);

    // Get config details
    const { data } = useQuery(getConfigDetailsForSavedCartsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    useMemo(() => {
        if (data != undefined) {
            const {
                mpSaveCartConfigs: { enabled, allow_share }
            } = data;
            setShowCopyUrl(allow_share);
            if (!enabled) {
                history.push('/');
            }
        }
    }, [data, history]);

    // Get carts details
    const { data: savedCartData, refetch } = useQuery(getSavedCartsQuery, {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
        variables: {
            pageSize: pageSize,
            currentPage: currentPage
        }
    });

    useMemo(() => {
        if (savedCartData != undefined) {
            const {
                mpSaveCartGetCarts: { total_count, items }
            } = savedCartData;

            setCarts(items);
            setTotalPage(Math.ceil(total_count / pageSize));
            setIsLoading(false);
        }
    }, [savedCartData, pageSize]);

    // Handle Page Size
    const handlePageSize = useCallback(event => {
        setCurrentPage(DEFAULT_CURRENT_PAGE);
        setPageSize(parseInt(event.target.value));
    }, []);

    // Handle Current Page
    const handleCurrentPage = useCallback(value => {
        setCurrentPage(value);
    }, []);

    const handleIsLoading = useCallback(value => {
        setIsLoading(value);
    }, []);

    const getSavedCarts = useCallback(async () => {
        await refetch({
            pageSize: pageSize,
            currentPage: currentPage
        });
    }, [refetch, pageSize, currentPage]);

    return {
        isLoading,
        carts,
        pageSize,
        currentPage,
        totalPage,
        showCopyUrl,
        handlePageSize,
        handleCurrentPage,
        handleIsLoading,
        getSavedCarts
    };
};
