import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useToasts } from '@magento/peregrine';
import { useUserContext } from '../../context/user';
import { useAwaitQuery } from '../../hooks/useAwaitQuery';

export const useNewsletterSubscription = props => {
    const { subscribeMutation, customerQuery } = props;
    const [{ currentUser, isSignedIn }, { getUserDetails }] = useUserContext();

    const [subscribe, setSubscribe] = useState(
        currentUser && currentUser.hasOwnProperty('is_subscribed')
            ? currentUser.is_subscribed
            : false
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [subscription, { error: subscriptionError }] = useMutation(
        subscribeMutation,
        {
            fetchPolicy: 'no-cache'
        }
    );
    const fetchUserDetails = useAwaitQuery(customerQuery);
    const [, { addToast }] = useToasts();

    const errors = [];
    if (subscriptionError) {
        errors.push(subscriptionError.graphQLErrors[0]);
    }

    const toggleSubscription = useCallback(() => {
        setSubscribe(!subscribe);
    }, [subscribe, setSubscribe]);

    const handleSubmit = useCallback(
        async ({ is_subscribed }) => {
            setIsSubmitting(true);
            try {
                if (is_subscribed === undefined) {
                    is_subscribed = subscribe;
                }
                await subscription({
                    variables: { is_subscribed }
                });
                addToast({
                    type: 'info',
                    message: 'Save user communications successfully!',
                    timeout: 3000
                });

                // Ensure old stores are updated with any new data.
                getUserDetails({ fetchUserDetails });
                setIsSubmitting(false);
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                setIsSubmitting(false);
            }
        },
        [subscription, addToast, fetchUserDetails, getUserDetails, subscribe]
    );

    return {
        errors,
        is_subscribed: subscribe,
        isDisabled: isSubmitting,
        isSignedIn,
        toggleSubscription,
        handleSubmit
    };
};
