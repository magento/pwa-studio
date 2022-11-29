import { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useNoReorderProductContext } from '@orienteed/customComponents/components/NoReorderProductProvider/noReorderProductProvider';
import { GET_PARENT_SKU } from '../../quickOrderForm/src/graphql/addProductByCsv.gql';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';

const useReOrderItems = ({ order, addConfigurableProductToCartMutation }) => {
    const history = useHistory();
    const { setNoProduct, setLoadingProduct } = useNoReorderProductContext();
    const [isLoading] = useState(false);
    const [{ cartId }] = useCartContext();

    const getParentSku = useAwaitQuery(GET_PARENT_SKU);
    const [addConfigurableProductToCart] = useMutation(
        addConfigurableProductToCartMutation || operations.addConfigurableProductToCartMutation
    );

    const handleAddToCart = useCallback(
        async (product, parentSku) => {
            const variables = {
                cartId,
                parentSku,
                quantity: product.quantity_ordered,
                sku: product.product_sku
            };

            try {
                await addConfigurableProductToCart({
                    variables
                });
            } catch (error) {
                if (error) return setNoProduct(true);
            }
        },
        [addConfigurableProductToCart, cartId, setNoProduct]
    );

    const handleReOrderClick = async () => {
        for (const element of order.items) {
            const { data } = await getParentSku({
                variables: { sku: element.product_sku }
            });
            await handleAddToCart(element, data?.products?.items[0].orParentSku);
            setLoadingProduct(true);
            window.scroll({ top: 0, left: 0 });
        }
        setLoadingProduct(false);
        history.push('/checkout');
    };

    return {
        isLoading,
        handleReOrderClick
    };
};

export default useReOrderItems;
