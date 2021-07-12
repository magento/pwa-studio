import { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useCartContext } from '../../context/cart';
import { useHistory } from 'react-router-dom';
import operations from './addToCart.gql';


export const useAddToCartButton = props => {
    const { item } = props;
    const [isLoading, setIsLoading] = useState(false);
    const isInStock = item.stock_status === 'IN_STOCK';
    const productType = item.type_id;
    const unsupportedProductType = productType === "virtual" || productType === "bundle" || productType === "downloadable"; 
    const isDisabled = isLoading || !isInStock || unsupportedProductType;
    const history = useHistory();

    const [addToCart, {data}] = useMutation(operations.ADD_PRODUCT_TO_CART); 

    const handleAddToCart = useCallback(async () => {
        try {
            if (productType === "simple") {
                setIsLoading(true);
                console.log(`Adding ${item.name} to Cart`);
                console.log(`Item is of type ${productType}`);
                return {
                    cartId,
                    cartItem: {
                        quantity: 1,
                        selected_options: [],
                        sku: item.sku
                    }
                };

                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            }
            else if (productType === "configurable") {
                history.push(`${item.url_key}.html`);
            }
            else{
                console.log('Unsupported product type unable to handle.');
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
