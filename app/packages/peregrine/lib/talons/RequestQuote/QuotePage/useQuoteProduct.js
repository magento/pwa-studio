import { useCallback, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { AFTER_UPDATE_MY_QUOTE } from '../useQuoteCartTrigger';

import DEFAULT_OPERATIONS from '../requestQuote.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useQuoteProduct = props => {
    const { item, setIsCartUpdating } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { updateQuoteMutation, deleteItemFromQuoteMutation } = operations;

    const [removeItem, { called: removeItemCalled, loading: removeItemLoading }] = useMutation(
        deleteItemFromQuoteMutation
    );

    const [updateItemQuantity, { loading: updateItemLoading, called: updateItemCalled }] = useMutation(
        updateQuoteMutation
    );

    useEffect(() => {
        if (updateItemCalled || removeItemCalled) {
            // If a product mutation is in flight, tell the cart.
            setIsCartUpdating(updateItemLoading || removeItemLoading);
        }

        // Reset updating state on unmount
        return () => setIsCartUpdating(false);
    }, [removeItemCalled, removeItemLoading, setIsCartUpdating, updateItemCalled, updateItemLoading]);

    // Use local state to determine whether to display errors or not.
    // Could be replaced by a "reset mutation" function from apollo client.
    // https://github.com/apollographql/apollo-feature-requests/issues/170

    const handleRemoveFromCart = useCallback(async () => {
        try {
            const {
                data: {
                    deleteItemFromMpQuote: { quote }
                }
            } = await removeItem({
                variables: {
                    itemId: item.id
                }
            });
            await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_QUOTE, { detail: quote }));
        } catch (err) {
            // Make sure any errors from the mutation are displayed.
        }
    }, [item, removeItem]);

    const handleUpdateItemQuantity = useCallback(
        async quantity => {
            try {
                const {
                    data: {
                        updateMpQuote: { quote }
                    }
                } = await updateItemQuantity({
                    variables: {
                        input: {
                            items: [
                                {
                                    item_id: item.id,
                                    qty: quantity
                                }
                            ]
                        }
                    }
                });
                await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_QUOTE, { detail: quote }));
            } catch (err) {
                // Make sure any errors from the mutation are displayed.
                setDisplayError(true);
            }
        },
        [item, updateItemQuantity]
    );

    return {
        handleRemoveFromCart,
        handleUpdateItemQuantity
    };
};
