import { useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { getSearchParam } from '@magento/peregrine/lib/hooks/useSearchParam';
import { useHistory, useLocation } from 'react-router-dom';

/**
 * Return props necessary to render a CategoryFilters component.
 *
 * @param {Object} props
 * @param {String} props.query - graphql query used for executing search
 * @param {Function} props.executeSearch - callback to execute a search
 * @param {String} props.categoryId - optional category id filter for search
 */
export const useCategoryFilters = props => {
    const { query, executeSearch, categoryId } = props;
    const history = useHistory();
    const location = useLocation();

    const handleClearCategoryFilter = useCallback(() => {
        const inputText = getSearchParam('query', location);

        if (inputText) {
            executeSearch(inputText, history);
        }
    }, [executeSearch, history, location]);

    const { loading, error, data } = useQuery(query, {
        variables: { id: categoryId }
    });

    let queryResult;
    if (loading) queryResult = 'Loading...';
    else if (error) queryResult = null;
    else queryResult = data.category.name;

    return {
        handleClearCategoryFilter,
        queryResult
    };
};
