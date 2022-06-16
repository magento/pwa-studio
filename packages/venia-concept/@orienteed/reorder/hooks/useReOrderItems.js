import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

// GraphQL mutation to fetch a reorderitems
const RE_ORDER_ITEMS = gql`
    mutation reOrderItems($orderNumber: String!) {
        reorderItems(orderNumber: $orderNumber) {
            cart {
                id
            }
        }
    }
`;

const useReOrderItems = () => {
    const history = useHistory();

    const [isLoading, setIsLoading] = useState(false);

    // Reorder Data
    const [reOrderItems, { data, loading }] = useMutation(RE_ORDER_ITEMS);

    const handleReOrderClick = async orderNumber => {
        if (loading) return null;
        await reOrderItems({
            variables: {
                orderNumber: orderNumber
            }
        });
        if (data) storage.setItem('cartId', data.reorderItems.cart.id);
        history.push('/checkout');
        location.reload();
    };

    return {
        isLoading,
        handleReOrderClick
    };
};

export default useReOrderItems;
