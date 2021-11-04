import { useCallback, useRef, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './contactUs.gql';

export default (props = {}) => {
    const { contactMutation, getStoreConfigQuery } = mergeOperations(
        DEFAULT_OPERATIONS,
        props.operations
    );

    const formApiRef = useRef(null);

    const [
        submitForm,
        { data, error: contactError, loading: submitLoading }
    ] = useMutation(contactMutation, {
        fetchPolicy: 'no-cache'
    });

    const { data: storeConfigData, loading: configLoading } = useQuery(
        getStoreConfigQuery,
        {
            fetchPolicy: 'cache-and-network'
        }
    );

    const isEnabled = useMemo(() => {
        return !!storeConfigData?.storeConfig?.contact_enabled;
    }, [storeConfigData]);

    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const handleSubmit = useCallback(
        async ({ name, email, comment, telephone }) => {
            try {
                await submitForm({
                    variables: {
                        name,
                        email,
                        comment,
                        telephone
                    }
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
        [submitForm]
    );
    const errors = useMemo(
        () => new Map([['contactMutation', contactError]]),
        [contactError]
    );

    return {
        isEnabled,
        errors,
        handleSubmit,
        isBusy: submitLoading,
        isLoading: configLoading,
        setFormApi,
        response: data && data.contactUs
    };
};
