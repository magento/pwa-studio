import { useCallback, useRef, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './newsletter.gql';

export const useNewsletter = (props = {}) => {
    const { subscribeMutation, getStoreConfigQuery } = mergeOperations(
        DEFAULT_OPERATIONS,
        props.operations
    );

    const formApiRef = useRef(null);

    const [newsLetterError, setNewsLetterError] = useState(null);

    const clearErrors = () => setNewsLetterError(null);

    const [
        subscribeNewsLetter,
        { data, loading: subscribeLoading }
    ] = useMutation(subscribeMutation, {
        fetchPolicy: 'no-cache',
        onError: setNewsLetterError
    });

    const { data: storeConfigData, loading: configLoading } = useQuery(
        getStoreConfigQuery,
        {
            fetchPolicy: 'cache-and-network'
        }
    );

    const isEnabled = useMemo(() => {
        return !!storeConfigData?.storeConfig?.newsletter_enabled;
    }, [storeConfigData]);

    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const handleSubmit = useCallback(
        async ({ email }) => {
            try {
                await subscribeNewsLetter({
                    variables: { email }
                });
                if (formApiRef.current) {
                    formApiRef.current.reset();
                }
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
            }
        },
        [subscribeNewsLetter]
    );
    const errors = useMemo(
        () => new Map([['subscribeMutation', newsLetterError]]),
        [newsLetterError]
    );

    return {
        isEnabled,
        errors,
        handleSubmit,
        isBusy: subscribeLoading,
        isLoading: configLoading,
        setFormApi,
        newsLetterResponse: data && data.subscribeEmailToNewsletter,
        clearErrors
    };
};
