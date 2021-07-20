import { useCallback } from 'react';
import { useMutation } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './createWishlistForm.gql';
import { useFormState } from 'informed';

export const useCreateWishlistForm = props => {
    const { onCancel, onCreateList, isAddLoading } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const [
        createList,
        { loading: isCreateLoading, error: createWishlistError }
    ] = useMutation(operations.createWishlistMutation);

    const { values } = useFormState();

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    const handleSave = useCallback(async () => {
        try {
            const visibility = values.visibility
                ? values.visibility
                : 'PRIVATE';

            const { data } = await createList({
                variables: {
                    name: values.listname,
                    visibility
                }
            });
            const wishlistId = data.createWishlist.wishlist.id;

            onCreateList(wishlistId);
        } catch (err) {
            console.log(err);
        }
    }, [createList, onCreateList, values]);

    return {
        formErrors: [createWishlistError],
        handleCancel,
        handleSave,
        isSaveDisabled: isCreateLoading || isAddLoading
    };
};
