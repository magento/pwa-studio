import { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useCartContext } from '../../context/cart';
import operations from './addToCart.gql';

export const useAddToCartButton = props => {
    const { item } = props;
    const [isOpen, setIsOpen] = useState(false);

    const [{ cartId }] = useCartContext();
    const [addToCart,{data}] = useMutation(operations.ADD_PRODUCT_TO_CART); //added

    const handleOpenDialog = useCallback(() => {
        setIsOpen(true);
    }, [item]);

    const handleCloseDialog = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);
    const getMutationVariables = useCallback(() => {
        return {
            cartId,
            cartItem: {
                quantity: 1,
                selected_options: [],
                sku: item.sku
            }
        };
    }, [cartId, item]);

    const handleAddToCart = useCallback(async () => {
        const variables = getMutationVariables();

        try {
            await addToCart({
              variables
            })

            setIsOpen(false);
        } catch (error) {
            console.error(error);
        }
    }, [setIsOpen, getMutationVariables]);

    return {
        isOpen,
        handleOpenDialog,
        handleCloseDialog,
        handleAddToCart
    };
};
