import { useCallback, useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { useMutation, useLazyQuery } from '@apollo/client';
import { ADD_SIMPLE_PRODUCT_TO_MP_QUOTE, GET_PRODUCTS } from '@orienteed/requestQuote/src/query/requestQuote.gql';
import { AFTER_UPDATE_MY_REQUEST_QUOTE } from '@orienteed/requestQuote/src/talons/useQuoteCartTrigger';
import { setQuoteId } from '@orienteed/requestQuote/src/store';

export const useAddProductBySku = props => {
    const [products, setProducts] = useState([]);
    const [isFatching, setIsFatching] = useState(false);

    // SimpleProduct Mutation
    const [addSimpleProductToCart] = useMutation(ADD_SIMPLE_PRODUCT_TO_MP_QUOTE);

    // Prepare to run the queries.
    const [runSearch, productResult] = useLazyQuery(GET_PRODUCTS, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const debouncedRunQuery = useMemo(
        () =>
            debounce(inputText => {
                runSearch({ variables: { search: inputText } });
            }, 500),
        [runSearch]
    );

    // Add Simple Product
    const handleAddItemBySku = useCallback(async productSku => {
        const variables = {
            input: {
                cart_items: [
                    {
                        data: {
                            sku: productSku,
                            quantity: 1
                        }
                    }
                ]
            }
        };

        const {
            data: {
                addSimpleProductsToMpQuote: { quote }
            }
        } = await addSimpleProductToCart({
            variables
        });
        await setQuoteId(quote.entity_id);
        await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_REQUEST_QUOTE, { detail: quote }));
    });

    useEffect(() => {
        if (productResult.data != undefined) {
            const { data, error } = productResult;
            if (data.products) {
                const {
                    products: { items }
                } = data;
                setProducts(items);
            }
        }
        setIsFatching(false);
    }, [productResult]);

    const handleSearchData = useCallback(async () => {
        setProducts([]);
        const searchField = document.querySelector('#searchProduct').value;
        if (searchField.length > 2) {
            setIsFatching(true);
            // Get Products
            await debouncedRunQuery(searchField);
        }
    }, [debouncedRunQuery, productResult]);

    return {
        products,
        isFatching,
        handleAddItemBySku,
        handleSearchData
    };
};
