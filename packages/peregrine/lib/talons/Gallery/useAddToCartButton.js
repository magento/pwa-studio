import { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useCartContext } from '../../context/cart';
import ADD_PRODUCT_TO_CART from './addToCart.gql';

export const useAddToCartButton = props => {
    const { item } = props;
    const [isLoading, setIsLoading] = useState(false);
    const isInStock = item.stock_status === 'IN_STOCK';
    const isDisabled = isLoading || !isInStock; 
    const type = item.type_id; 

    const handleAddToCart = useCallback(async () => {
        try {
            if (type === "simple"){
            setIsLoading(true);
            console.log(`Adding ${item.name} to Cart`);

            console.log(`Added ${item.name} to Cart`);

            setTimeout(() => {
                setIsLoading(false);
            }, 1000);}
            else if (type === "configurable"){

            }
        } catch (error) {
            console.error(error);
        }
    }, [item]);


    return {
        isLoading,
        handleAddToCart,
        isDisabled,
        isInStock
    };
}
