import { useCallback, useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {
    MP_QUOTE,
    DELETE_CURRENT_QUOTE,
    SUBMIT_CURRENT_QUOTE,
    GET_CONFIG_DETAILS
} from '../RequestQuote/requestQuote.gql';
import { AFTER_UPDATE_MY_REQUEST_QUOTE } from './useQuoteCartTrigger';
import { deleteQuoteId } from '../RequestQuote/Store';

export const useQuoteCartPage = props => {
    const { getQuoteId } = props;

    const [myQuote, setMyQuote] = useState({});
    const [submittedQuoteId, setSubmittedQuoteId] = useState(0);
    const [activeEditItem, setActiveEditItem] = useState(false);
    const [isCartUpdating, setIsCartUpdating] = useState(false);

    const history = useHistory();

    // Get config details
    const { loading: configLoading, data: configData } = useQuery(GET_CONFIG_DETAILS, {
        fetchPolicy: 'network-only'
    });
    useMemo(() => {
        if (!configLoading && configData === undefined) {
            history.push('/');
        }
    }, [configData, configLoading, history]);

    // Delete Current Quote Mutation
    const [deleteCurrentQuote] = useMutation(DELETE_CURRENT_QUOTE);

    // Submit Current Quote Mutation
    const [submitCurrentQuote] = useMutation(SUBMIT_CURRENT_QUOTE);

    // Get Mp Quote
    const { data, loading } = useQuery(MP_QUOTE, {
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
            AFTER_UPDATE_MY_REQUEST_QUOTE,
            async function(event) {
                await setMyQuote(event.detail);
            },
            false
        );
    });

    const handleDeleteQuote = useCallback(async () => {
        await deleteCurrentQuote();
        await deleteQuoteId();
        await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_REQUEST_QUOTE, { detail: {} }));
    }, [deleteCurrentQuote]);

    const handleSubmitQuoteBtn = useCallback(async () => {
        const {
            data: { mpQuoteSubmit }
        } = await submitCurrentQuote();
        await deleteQuoteId();
        await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_REQUEST_QUOTE, { detail: {} }));
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
