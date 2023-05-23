import { useMemo, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useToasts } from '@magento/peregrine';
import { useMutation, useLazyQuery } from '@apollo/client';

import DEFAULT_OPERATIONS from './compareProduct.gql';
import mergeOperations from '../../util/shallowMerge';

const useCompareProduct = () => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const {
        createCompareListMutation,
        deleteProductsFromCompareListMutation,
        getCustomerCompareListQuery
    } = operations;

    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    const [isLoading, setIsLoading] = useState(false);
    const [isAction, setIsAction] = useState(false);
    const [createCompareList] = useMutation(createCompareListMutation);
    const [deleteProductsFromList] = useMutation(deleteProductsFromCompareListMutation);
    const [getCustomerCompareList, { data, loading }] = useLazyQuery(getCustomerCompareListQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const deleteProduct = async item => {
        await deleteProductsFromList({
            variables: {
                uid: data?.customer?.compare_list?.uid,
                products: [item.uid]
            }
        });
        setIsAction(!isAction);
        addToast({
            type: 'success',
            message: formatMessage({
                id: 'compareProducts.deletecompareProducts',
                defaultMessage: 'The product was deleted from compare products list'
            }),
            timeout: 7000
        });
    };

    const productsItems = useMemo(() => {
        return (data && data?.customer?.compare_list) || [];
    }, [data]);

    const productsCount = useMemo(() => {
        return data?.customer?.compare_list?.item_count || 0;
    }, [data]);
    useEffect(() => {
        getCustomerCompareList();
        setIsLoading(loading);
    }, [getCustomerCompareList, isAction, loading]);

    const addProductsToCompare = async product => {
        const { id } = product;
        await createCompareList({
            variables: {
                products: [id]
            }
        });
        addToast({
            type: 'success',
            message: formatMessage({
                id: 'compareProducts.addTocompare',
                defaultMessage: 'The product was added to compare products'
            }),
            timeout: 7000
        });
        setIsAction(!isAction);
    };

    return {
        productsItems: productsItems,
        addProductsToCompare,
        deleteProduct,
        productsCount,
        isLoading
    };
};

export default useCompareProduct;
