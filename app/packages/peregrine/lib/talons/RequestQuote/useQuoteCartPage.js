import { useCallback, useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { AFTER_UPDATE_MY_QUOTE } from './useQuoteCartTrigger';
import { deleteQuoteId } from './Store';

import DEFAULT_OPERATIONS from '../RequestQuote/requestQuote.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useQuoteCartPage = props => {
    const { getQuoteId } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const {
        getQuoteByIdQuery,
        deleteCurrentQuoteMutation,
        submitCurrentQuoteMutation,
        getQuoteConfigDetailsQuery
    } = operations;

    const [myQuote, setMyQuote] = useState({});
    const [submittedQuoteId, setSubmittedQuoteId] = useState(0);
    const [activeEditItem, setActiveEditItem] = useState(false);
    const [isCartUpdating, setIsCartUpdating] = useState(false);

    const history = useHistory();

    // Get config details
    const { loading: configLoading, data: configData } = useQuery(getQuoteConfigDetailsQuery, {
        fetchPolicy: 'network-only'
    });
    useMemo(() => {
        if (!configLoading && configData === undefined) {
            history.push('/');
        }
    }, [configData, configLoading, history]);

    // Delete Current Quote Mutation
    const [deleteCurrentQuote] = useMutation(deleteCurrentQuoteMutation);

    // Submit Current Quote Mutation
    const [submitCurrentQuote] = useMutation(submitCurrentQuoteMutation);

    // Get Mp Quote
    const { data, loading } = useQuery(getQuoteByIdQuery, {
        fetchPolicy: 'network-only',
        variables: {
            quote_id: getQuoteId()
        }
    });
    useEffect(() => {
        if (data != undefined) {
            const {
                mpQuote: { quote }
            } = data;
            setMyQuote(quote);
        }
    }, [data]);

    useState(() => {
        window.addEventListener(
            AFTER_UPDATE_MY_QUOTE,
            async function(event) {
                await setMyQuote(event.detail);
            },
            false
        );
    });

    const handleDeleteQuote = useCallback(async () => {
        await deleteCurrentQuote();
        await deleteQuoteId();
        await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_QUOTE, { detail: {} }));
    }, [deleteCurrentQuote]);

    const handleSubmitQuoteBtn = useCallback(async () => {
        const {
            data: { mpQuoteSubmit }
        } = await submitCurrentQuote();
        await deleteQuoteId();
        await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_QUOTE, { detail: {} }));
        await history.push('/mprequestforquote/quoteCart/success/' + mpQuoteSubmit);
    }, [submitCurrentQuote, history]);

    return {
        loading,
        myQuote,
        submittedQuoteId,
        setActiveEditItem,
        setIsCartUpdating,
        handleDeleteQuote,
        handleSubmitQuoteBtn
    };
};
