import { useEffect, useMemo, useState } from 'react';
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
    const { query, visible } = props;
    const [cleared, setCleared] = useState(false);

    // prepare to run query
    const [runQuery, queryResult] = useLazyQuery(query);
    const { called, data, error, loading } = queryResult;

    // retrieve value from another field
    const { value } = useFieldState('search_query');
    const valid = value && value.length > 2;

    // Create a debounced function so we only search some delay after the last
    // keypress.
    const debouncedRunQuery = useMemo(() => debounce(runQuery, 500), [
        runQuery
    ]);

    // run the query once on mount, and again whenever state changes
    useEffect(() => {
        if (visible && valid) {
            setCleared(false);
            debouncedRunQuery({ variables: { inputText: value } });
        } else if (called && !value && !visible) {
            setCleared(true);
        }
    }, [called, debouncedRunQuery, setCleared, valid, value, visible]);

    // Handle results.
    const products = data && data.products;
    const hasResult = products && products.items;
    const resultCount = products && products.total_count;
    const displayResult = hasResult && !cleared;
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
