import { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useCartContext } from '../../context/cart';
import operations from './addToCart.gql';

export const useAddToCartButton = props => {
    const { item } = props; 
    const [isLoading, setIsLoading] = useState(false); 

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
        const isDisabled = isLoading || item.stock_status === 'OUT_STOCK'
        try {
            if (!isDisabled){
            setIsLoading(true); 
            console.log(`Adding ${item.name} to Cart`);
            variables
            console.log(`Added ${item.name} to Cart`);
        }
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }catch (error) {
            console.error(error); 
        }
    }, [cartId, item]);


    return {
        isLoading, 
        handleAddToCart, 
        isDisabled,
        stock_status
    };
};
