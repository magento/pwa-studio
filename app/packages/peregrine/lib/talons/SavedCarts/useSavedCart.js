import { useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation, useApolloClient, useQuery } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';

import CART_OPERATIONS from '../CartPage/cartPage.gql';
import DEFAULT_OPERATIONS from './savedCarts.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useSavedCart = () => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, CART_OPERATIONS);
    const {
        createCartMutation,
        getConfigDetailsForSavedCartsQuery,
        getCartDetailsQuery,
        saveSavedCartsMutation
    } = operations;

    const [isShow, setIsShow] = useState(false);
    const [buttonTitle, setButtonTitle] = useState();
    const [isSaveCartLoading, setIsSaveCartLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);
    const apolloClient = useApolloClient();

    const [{ cartId }, { getCartDetails, createCart }] = useCartContext();

    const [fetchCartId] = useMutation(createCartMutation);

    const history = useHistory();

    const [getMpSaveCart] = useMutation(saveSavedCartsMutation);

    // Popup Open
    const handleSaveCart = useCallback(() => {
        setIsDialogOpen(true);
    }, [setIsDialogOpen]);
    const handleCancelDialog = useCallback(() => {
        setIsDialogOpen(false);
    }, []);

    // Getting Config details
    const { data } = useQuery(getConfigDetailsForSavedCartsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    useEffect(() => {
        if (data != undefined) {
            const {
                mpSaveCartConfigs: { enabled, button_title }
            } = data;
            if (enabled) {
                setButtonTitle(button_title);
                setIsShow(true);
            }
        }
    }, [data]);

    // Create New Save Cart
    const handleSubmitDialog = useCallback(
        async params => {
            try {
                const { mpsavecart_description, mpsavecart_name } = params;
                setIsSaveCartLoading(true);
                setErrorMessage(null);
                const {
                    data: { o_mpSaveCart }
                } = await getMpSaveCart({
                    fetchPolicy: 'no-cache',
                    variables: {
                        cartId: cartId,
                        cartName: mpsavecart_name,
                        description: mpsavecart_description
                    }
                });

                if (o_mpSaveCart) {
                    await clearCartDataFromCache(apolloClient);
                    await createCart({
                        fetchCartId
                    });

                    await getCartDetails({
                        cartId,
                        fetchCartDetails
                    });
                    setIsSaveCartLoading(false);
                    history.push('/mpsavecart');
                }
            } catch (e) {
                const error = e.toString();
                setErrorMessage(error.replace('Error:', ''));
                setIsError(true);
                setIsSaveCartLoading(false);
            }
        },
        [getMpSaveCart, getCartDetails, cartId, fetchCartDetails, fetchCartId, createCart, apolloClient, history]
    );

    return {
        isShow,
        buttonTitle,
        isSaveCartLoading,
        handleSaveCart,
        isError,
        errorMessage,
        isDialogOpen,
        handleCancelDialog,
        handleSubmitDialog
    };
};
