import { useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useUserContext } from '../../context/user';
import { useAwaitQuery } from '../../hooks/useAwaitQuery';

export const useCommunicationsPage = props => {
    const {
        mutations: { setNewsletterSubscriptionMutation },
        queries: { getCustomerQuery }
    } = props;

    const [{ currentUser, isSignedIn }, { getUserDetails }] = useUserContext();

    const initialValues = {
        isSubscribed:
            currentUser && currentUser.hasOwnProperty('is_subscribed')
                ? currentUser.is_subscribed
                : false
    };

    const [
        subscription,
        { error: subscriptionError, loading: isSubmitting }
    ] = useMutation(setNewsletterSubscriptionMutation);
    const fetchUserDetails = useAwaitQuery(getCustomerQuery);

    const handleSubmit = useCallback(
        async ({ isSubscribed }) => {
            if (isSubscribed === undefined) {
                isSubscribed = initialValues.isSubscribed;
            }
            await subscription({
                variables: { is_subscribed: isSubscribed }
            });

            // Ensure old stores are updated with any new data.
            getUserDetails({ fetchUserDetails });
        },
        [subscription, fetchUserDetails, getUserDetails, initialValues]
    );

    return {
        formErrors: [subscriptionError],
        isDisabled: isSubmitting,
        isSignedIn,
        handleSubmit,
        initialValues
    };
};
