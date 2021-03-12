import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './newWishlistForm.gql';
import { useFormState } from 'informed';

export const useNewWishlistForm = props => {
    const { onCreateList, isAddLoading } = props;
    const { values } = useFormState();
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const [
        createList,
        { loading: isCreateLoading, error: createWishlistError }
    ] = useMutation(operations.createWishlistMutation);

    const [isOpen, setIsOpen] = useState(false);

    const handleNewListClick = useCallback(() => {
        setIsOpen(true);
    }, []);

    const handleCancel = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleSave = useCallback(async () => {
        try {
            const { listname, visibility } = values;

            const { data } = await createList({
                variables: {
                    name: listname,
                    visibility
                }
            });
            const wishlistId = data.createWishlist.wishlist.id;

            onCreateList(wishlistId);
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.log(err);
            }
        }
    }, [createList, onCreateList, values]);

    return {
        formErrors: [createWishlistError],
        handleCancel,
        handleNewListClick,
        handleSave,
        isOpen,
        isSaveDisabled: isCreateLoading || isAddLoading
    };
};
