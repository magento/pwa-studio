import { useCallback, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const usePriceSummary = props => {
    const [{ cartId }] = useCartContext();
    const { error, loading, data } = useQuery(props.query, {
        variables: {
            cartId
        },
        fetchPolicy: 'no-cache'
    });

    const handleProceedToCheckout = useCallback(() => {
        // TODO: Navigate to checkout view
        console.log('Going to checkout!');
    }, []);

    useEffect(() => {
        if (error) {
            console.error('GraphQL Error:', error);
        }
    }, [error]);

    return {
        handleProceedToCheckout,
        hasError: !!error,
        hasItems: data && !!data.cart.items.length,
        isLoading: !!loading,
        data
    };
};
