import { useCallback, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { useUserContext } from '../../context/user';

export const useCommunicationsPage = props => {
    const {
        mutations: { setNewsletterSubscriptionMutation },
        queries: { getCustomerSubscriptionQuery }
    } = props;

    const [{ isSignedIn }] = useUserContext();

    const { data: subscriptionData, error: subscriptionDataError } = useQuery(
        getCustomerSubscriptionQuery
    );

    const initialValues = useMemo(() => {
        if (subscriptionData) {
            return { isSubscribed: subscriptionData.customer.is_subscribed };
        }
    }, [subscriptionData]);

    const [
        setNewsletterSubscription,
        { error: setNewsletterSubscriptionError, loading: isSubmitting }
    ] = useMutation(setNewsletterSubscriptionMutation);

    const handleSubmit = useCallback(
        formValues => {
            setNewsletterSubscription({
                variables: formValues
            });
        },
        [setNewsletterSubscription]
    );

    return {
        formErrors: [setNewsletterSubscriptionError, subscriptionDataError],
        initialValues,
        handleSubmit,
        isDisabled: isSubmitting,
        isSignedIn
    };
};
