import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import configuredVariant from '@magento/peregrine/lib/util/configuredVariant';
import { UPDATE_MP_QUOTE, DELETE_ITEM_FROM_MP_QUOTE } from '@orienteed/requestQuote/src/query/requestQuote.gql';
import { getQuoteId } from '@orienteed/requestQuote/src/store';
import { AFTER_UPDATE_MY_REQUEST_QUOTE } from '@orienteed/requestQuote/src/talons/useQuoteCartTrigger';

export const useQuoteProduct = props => {
    const { item, setIsCartUpdating } = props;

    const [removeItem, { called: removeItemCalled, error: removeItemError, loading: removeItemLoading }] = useMutation(
        DELETE_ITEM_FROM_MP_QUOTE
    );

    const [
        updateItemQuantity,
        { loading: updateItemLoading, error: updateError, called: updateItemCalled }
    ] = useMutation(UPDATE_MP_QUOTE);

    useEffect(() => {
        if (updateItemCalled || removeItemCalled) {
            // If a product mutation is in flight, tell the cart.
            setIsCartUpdating(updateItemLoading || removeItemLoading);
        }

        // Reset updating state on unmount
        return () => setIsCartUpdating(false);
    }, [removeItemCalled, removeItemLoading, setIsCartUpdating, updateItemCalled, updateItemLoading]);

    const quoteId = getQuoteId();

    // Use local state to determine whether to display errors or not.
    // Could be replaced by a "reset mutation" function from apollo client.
    // https://github.com/apollographql/apollo-feature-requests/issues/170
    const [displayError, setDisplayError] = useState(false);

    const derivedErrorMessage = useMemo(() => {
        return (displayError && deriveErrorMessage([updateError, removeItemError])) || '';
    }, [displayError, removeItemError, updateError]);

    /*const handleEditItem = useCallback(() => {
        setActiveEditItem(item);

        // If there were errors from removing/updating the product, hide them
        // when we open the modal.
        setDisplayError(false);
    }, [item, setActiveEditItem]);*/

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
            await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_REQUEST_QUOTE, { detail: quote }));
        } catch (err) {
            // Make sure any errors from the mutation are displayed.
            setDisplayError(true);
        }
    }, [quoteId, item, removeItem]);

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
                await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_REQUEST_QUOTE, { detail: quote }));
            } catch (err) {
                // Make sure any errors from the mutation are displayed.
                setDisplayError(true);
            }
        },
        [quoteId, item, updateItemQuantity]
    );

    return {
        handleRemoveFromCart,
        handleUpdateItemQuantity
    };
};
