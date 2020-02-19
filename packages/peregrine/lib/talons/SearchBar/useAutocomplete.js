import { useEffect, useMemo } from 'react';
import { useFieldState } from 'informed';
import { useLazyQuery } from '@apollo/react-hooks';
import debounce from 'lodash.debounce';

/**
 * @typedef { import("graphql").DocumentNode } DocumentNode
 */

/**
 * Returns props necessary to render an Autocomplete component.
 * @param {Object} props
 * @param {DocumentNode} props.query - GraphQL query
 * @param {Boolean} props.visible - whether to show
 */
export const useAutocomplete = props => {
    const { query, valid, visible } = props;

    // prepare to run query
    const [runQuery, queryResult] = useLazyQuery(query);
    const { data, error, loading } = queryResult;

    // retrieve value from another field
    const { value } = useFieldState('search_query');

    // Create a debounced function so we only search some delay after the last
    // keypress.
    const debouncedRunQuery = useMemo(
        () =>
            debounce((inputText, isValid) => {
                if (isValid) {
                    runQuery({ variables: { inputText } });
                }
            }, 500),
        [runQuery]
    );

    // run the query once on mount, and again whenever state changes
    useEffect(() => {
        if (visible) {
            debouncedRunQuery(value, valid);
        }
    }, [debouncedRunQuery, valid, value, visible]);

    // Handle results.
    const products = data && data.products;
    const hasResult = products && products.items;
    const resultCount = products && products.total_count;
    const displayResult = valid && hasResult;
    let messageType = '';

    if (error) {
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
        displayResult,
        messageType,
        products,
        queryResult,
        resultCount,
        value
    };
};
