import { useEffect } from 'react';
import { useFieldState } from 'informed';
import { useLazyQuery } from '@apollo/react-hooks';

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

    // prepare to run query
    const [runQuery, queryResult] = useLazyQuery(query);
    const { data, error, loading } = queryResult;

    // retrieve value from another field
    const { value } = useFieldState('search_query');
    const valid = value && value.length > 2;

    // determine message type
    const products = data && data.products;
    const hasResult = products && products.items;
    const resultCount = hasResult && products.items.length;
    let messageType = '';

    if (error) {
        messageType = 'ERROR';
    } else if (loading) {
        messageType = 'LOADING';
    } else if (!hasResult) {
        messageType = 'PROMPT';
    } else if (!resultCount) {
        messageType = 'EMPTY_RESULT';
    } else {
        messageType = 'RESULT_SUMMARY';
    }

    // run the query once on mount, and again whenever state changes
    useEffect(() => {
        if (visible && valid) {
            runQuery({ variables: { inputText: value } });
        }
    }, [runQuery, valid, value, visible]);

    return {
        hasResult,
        messageType,
        products,
        queryResult,
        resultCount,
        value
    };
};
