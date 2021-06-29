import { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useCartContext } from '../../context/cart';
import operations from './addToCart.gql';

export const useAddToCartButton = props => {
    const { item } = props; // destructuring props.item ?
    const [isLoading, setIsLoading] = useState(false); // isLoading set to false
  
    //const [addToCart,{data}] = useMutation(operations.ADD_PRODUCT_TO_CART); //added

    const handleAddToCart = useCallback(async () => {

        try {
            setIsLoading(true); 
            console.log(`Adding ${item.name} to Cart`);

            /*
            await addToCart({
              cartId, 
              cartItem: {
                  quantity: 1, 
                  selected_options: [], 
                  sku: item.sku
              }
            })
            //prompt on console that item was added 
            */
            //disable button to after 1 second 
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        } catch (error) {
            console.error(error); // what would cause a console error
        }
    }, [item]);//why [item]

    return {
        isLoading, 
        handleAddToCart
    };
};
