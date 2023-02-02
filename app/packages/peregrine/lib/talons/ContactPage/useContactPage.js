import { useCallback, useRef, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './contactUs.gql';

export default props => {
    const { cmsBlockIdentifiers = [], operations } = props;
    const {
        contactMutation,
        getStoreConfigQuery,
        getContactPageCmsBlocksQuery
    } = mergeOperations(DEFAULT_OPERATIONS, operations);

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

    const { data: cmsBlocksData, loading: cmsBlocksLoading } = useQuery(
        getContactPageCmsBlocksQuery,
        {
            variables: {
                cmsBlockIdentifiers
            },
            fetchPolicy: 'cache-and-network'
        }
    );

    const isEnabled = useMemo(() => {
        return !!storeConfigData?.storeConfig?.contact_enabled;
    }, [storeConfigData]);

    const cmsBlocks = useMemo(() => {
        return cmsBlocksData?.cmsBlocks?.items || [];
    }, [cmsBlocksData]);

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
    const errors = useMemo(() => new Map([['contactMutation', contactError]]), [
        contactError
    ]);

    return {
        isEnabled,
        cmsBlocks,
        errors,
        handleSubmit,
        isBusy: submitLoading,
        isLoading: configLoading && cmsBlocksLoading,
        setFormApi,
        response: data && data.contactUs
    };
};
