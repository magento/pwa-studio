import { useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';

export const useProductForm = props => {
    const { cartItem, getConfigurableOptionsQuery } = props;

    const { data, error, loading } = useQuery(getConfigurableOptionsQuery, {
        variables: {
            sku: cartItem.product.sku
        }
    });

    const configItem = !loading && !error ? data.products.items[0] : null;

    const handleSubmit = useCallback(formValues => {
        console.log(formValues);
    });

    return { configItem, handleSubmit, isLoading: !!loading };
};
