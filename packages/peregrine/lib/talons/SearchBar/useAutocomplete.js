import { useEffect, useMemo } from 'react';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import { useLazyQuery } from '@apollo/client';
import debounce from 'lodash.debounce';
import { useEventingContext } from '../../context/eventing';

/**
 * @typedef { import("graphql").DocumentNode } DocumentNode
 */

/**
 * Returns props necessary to render an Autocomplete component.
 * @param {Object} props
 * @param {DocumentNode} props.query - GraphQL query
 * @param {Boolean} props.valid - whether to run the query
 * @param {Boolean} props.visible - whether to show the element
 */
export const useAutocomplete = props => {
    const {
        queries: { getAutocompleteResults },
        valid,
        visible
    } = props;

    const [, { dispatch }] = useEventingContext();

    // Prepare to run the queries.
    const [runSearch, productResult] = useLazyQuery(getAutocompleteResults, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    // Get the search term from the field.
    const { value } = useFieldState('search_query');

    // Create a debounced function so we only search some delay after the last
    // keypress.
    const debouncedRunQuery = useMemo(
        () =>
            debounce(inputText => {
                runSearch({ variables: { inputText } });
            }, 500),
        [runSearch]
    );

    // run the query once on mount, and again whenever state changes
    useEffect(() => {
        if (valid && visible) {
            debouncedRunQuery(value);

            if (value) {
                dispatch({
                    type: 'SEARCHBAR_REQUEST',
                    payload: {
                        query: value,
                        currentPage: 1, // Same value used in GQL query
                        pageSize: 3, // Same value used in GQL query
                        refinements: []
                    }
                });
            }
        }
    }, [debouncedRunQuery, valid, value, visible, dispatch]);

    const { data, error, loading } = productResult;

    // Handle results.
    const categories = data && data.products?.aggregations[1]?.options;
    const products = data && data.products;
    const filters = data && data.products.aggregations;
    const hasResult = products && products.items;
    const resultCount = products && products.total_count;
    const displayResult = valid && hasResult;
    const invalidCharacterLength = !valid && value ? true : false;
    let messageType = '';

    if (invalidCharacterLength) {
        messageType = 'INVALID_CHARACTER_LENGTH';
    } else if (error) {
        messageType = 'ERROR';
    } else if (loading) {
        messageType = 'LOADING';
    } else if (!displayResult) {
        messageType = 'PROMPT';
    } else if (!resultCount) {
        messageType = 'EMPTY_RESULT';
    } else {
        messageType = 'RESULT_SUMMARY';
    }

    return {
        categories,
        displayResult,
        filters,
        messageType,
        products,
        resultCount,
        value
    };
};
