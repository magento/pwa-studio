import { useCallback, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { useUserContext } from '../../context/user';

export const useCommunicationsPage = props => {
    const {
        afterSubmit,
        mutations: { setNewsletterSubscriptionMutation },
        queries: { getCustomerSubscriptionQuery }
    } = props;

    const [{ isSignedIn }] = useUserContext();

    const { data: subscriptionData, error: subscriptionDataError } = useQuery(
        getCustomerSubscriptionQuery,
        { skip: !isSignedIn }
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
        async formValues => {
            try {
                await setNewsletterSubscription({
                    variables: formValues
                });
            } catch {
                // we have an onError link that logs errors, and FormError already renders this error, so just return
                // to avoid triggering the success callback
                return;
            }
            if (afterSubmit) {
                afterSubmit();
            }
        },
        [setNewsletterSubscription, afterSubmit]
    );

    return {
        formErrors: [setNewsletterSubscriptionError, subscriptionDataError],
        initialValues,
        handleSubmit,
        isDisabled: isSubmitting,
        isSignedIn
    };
};
