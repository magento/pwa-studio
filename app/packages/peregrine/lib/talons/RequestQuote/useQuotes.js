import { useMemo, useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import {
    GET_CONFIG_DETAILS,
    GET_MP_QUOTE_LIST,
    DELETE_SUBMITTED_MP_QUOTE,
    CANCEL_MP_QUOTE,
    DUPLICATE_MP_QUOTE,
    ADD_MP_QUOTE_TO_CART
} from '../RequestQuote/requestQuote.gql';
import { AFTER_UPDATE_MY_REQUEST_QUOTE } from './useQuoteCartTrigger';

import { setQuoteId } from '../RequestQuote/Store';

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_CURRENT_PAGE = 1;
const DEFAULT_TOTAL_PAGE = 0;

/**
 * @function
 *
 * @param {Object} props
 *
 * @returns {useQuotes}
 */
export const useQuotes = () => {
    const history = useHistory();
    const [quotes, setQuotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
    const [totalPage, setTotalPage] = useState(DEFAULT_TOTAL_PAGE);
    const [isOpen, setIsOpen] = useState(false);

    // Get config details
    const { data: configData, loading: configLoading } = useQuery(GET_CONFIG_DETAILS, {
        fetchPolicy: 'network-only'
    });
    useMemo(() => {
        if (!configLoading && configData == undefined) {
            history.push('/account-information');
        }
    }, [configData, configLoading, history]);

    // Delete Quote Mutation
    const [deleteSubmittedMpQuote] = useMutation(DELETE_SUBMITTED_MP_QUOTE);

    // Cancel Quote Mutation
    const [cancelMpQuote] = useMutation(CANCEL_MP_QUOTE);

    // Duplicate Quote Mutation
    const [duplicateMpQuote] = useMutation(DUPLICATE_MP_QUOTE);

    // Add Quote To Cart Mutation
    const [addMpQuoteToCart] = useMutation(ADD_MP_QUOTE_TO_CART);

    // Get quotes details
    const { data: quoteList, refetch, loading } = useQuery(GET_MP_QUOTE_LIST, {
        fetchPolicy: 'network-only',
        variables: {
            pageSize: pageSize,
            currentPage: currentPage
        }
    });

    const handleContentToggle = useCallback(() => {
        setIsOpen(currentValue => !currentValue);
    }, []);

    useEffect(() => {
        setIsLoading(loading);
        if (quoteList != undefined) {
            const {
                mpQuoteList: {
                    page_info: { total_pages },
                    items
                }
            } = quoteList;
            setQuotes(items);
            setTotalPage(total_pages);
            setIsLoading(false);
        }
    }, [quoteList, loading]);

    const getMpQuoteList = useCallback(async () => {
        await refetch({
            pageSize: pageSize,
            currentPage: currentPage
        });
    }, [refetch, pageSize, currentPage]);

    // Handle Page Size
    const handlePageSize = useCallback(async event => {
        await setIsLoading(true);
        await setCurrentPage(DEFAULT_CURRENT_PAGE);
        await setPageSize(parseInt(event.target.value));
        await setIsLoading(false);
    }, []);

    // Handle Current Page
    const handleCurrentPage = useCallback(async value => {
        await setIsLoading(true);
        await setCurrentPage(value);
        await setIsLoading(false);
    }, []);

    // Handle Delete Page
    const handleDeleteQuote = useCallback(
        async value => {
            await setIsLoading(true);
            await deleteSubmittedMpQuote({
                variables: {
                    quoteId: parseInt(value)
                }
            });
            await refetch({
                pageSize: pageSize,
                currentPage: currentPage
            });
            await setIsLoading(false);
        },
        [refetch, pageSize, currentPage, deleteSubmittedMpQuote]
    );

    // Handle cancel Page
    const handleCancelQuote = useCallback(
        async value => {
            await setIsLoading(true);
            await cancelMpQuote({
                variables: {
                    quoteId: parseInt(value)
                }
            });
            await refetch({
                pageSize: pageSize,
                currentPage: currentPage
            });
            await setIsLoading(false);
        },
        [refetch, pageSize, currentPage, cancelMpQuote]
    );

    // Handle duplicate Page
    const handleDuplicateQuote = useCallback(
        async value => {
            await setIsLoading(true);
            const {
                data: {
                    duplicateMpQuote: { quote }
                }
            } = await duplicateMpQuote({
                variables: {
                    quoteId: parseInt(value)
                }
            });
            await refetch({
                pageSize: pageSize,
                currentPage: currentPage
            });
            await setQuoteId(quote.entity_id);
            await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_REQUEST_QUOTE, { detail: { ...quote } }));
            await setIsLoading(false);
        },
        [refetch, pageSize, currentPage, duplicateMpQuote]
    );

    // Handle add to cart Page
    const handleQuoteToCart = useCallback(
        async value => {
            await setIsLoading(true);
            await addMpQuoteToCart({
                variables: {
                    quoteId: parseInt(value)
                }
            });
            await refetch({
                pageSize: pageSize,
                currentPage: currentPage
            });
            history.go(0);
        },
        [refetch, pageSize, currentPage, addMpQuoteToCart, history]
    );

    return {
        quotes,
        isLoading,
        totalPage,
        getMpQuoteList,
        isOpen,
        pageSize,
        currentPage,
        handleContentToggle,
        handlePageSize,
        handleCurrentPage,
        handleDeleteQuote,
        handleCancelQuote,
        handleDuplicateQuote,
        handleQuoteToCart
    };
};
