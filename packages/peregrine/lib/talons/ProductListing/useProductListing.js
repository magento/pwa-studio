import { useQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../context/cart';

export const useProductListing = props => {
    const { query } = props;

    const [{ cartId }] = useCartContext();

    const { data, error, loading } = useQuery(query, {
        variables: { cartId },
        fetchPolicy: 'cache-and-network'
    });

    let items = [];
    if (!error && !loading) {
        items = data.cart.items;
    }

    if (error) {
        console.error(error);
    }

    return {
        isLoading: !!loading,
        items
    };
};
