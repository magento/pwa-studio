import { useCallback, useRef, useState, useMemo } from 'react';
import { useMutation } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './newsletter.gql';
export const useNewsletter = (props = {}) => {
    const { subscribeMutation } = mergeOperations(
        DEFAULT_OPERATIONS,
        props.operations
    );
    const [subscribing, setSubscribing] = useState(false);
    const [subscribeNewsLetter, { error: newsLetterError, data }] = useMutation(
        subscribeMutation,
        {
            fetchPolicy: 'no-cache'
        }
    );
    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const handleSubmit = useCallback(
        async ({ email }) => {
            setSubscribing(true);
            try {
                await subscribeNewsLetter({
                    variables: { email }
                });
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
            }
            setSubscribing(false);
        },
        [subscribeNewsLetter]
    );
    const errors = useMemo(
        () => new Map([['subscribeMutation', newsLetterError]]),
        [newsLetterError]
    );
    return {
        errors,
        handleSubmit,
        isBusy: subscribing,
        setFormApi,
        newsLetterResponse: data && data.subscribeEmailToNewsletter
    };
};
