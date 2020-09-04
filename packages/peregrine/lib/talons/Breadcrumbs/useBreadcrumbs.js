import { useMemo } from 'react';
import { useQuery } from '@apollo/client';

// Just incase the data is unsorted, lets sort it.
const sortCrumbs = (a, b) => a.category_level > b.category_level;

// Generates the path for the category.
const getPath = (path, suffix) => {
    if (path) {
        return `/${path}${suffix}`;
    }

    // If there is no path this is just a dead link.
    return '#';
};

/**
 * Returns props necessary to render a Breadcrumbs component.
 *
 * @param {object} props
 * @param {object} props.query - the breadcrumb query
 * @param {string} props.categoryId - the id of the category for which to generate breadcrumbs
 * @return {{
 *   currentCategory: string,
 *   currentCategoryPath: string,
 *   isLoading: boolean,
 *   normalizedData: array
 * }}
 */
export const useBreadcrumbs = props => {
    const { categoryId, query } = props;

    const { data, loading, error } = useQuery(query, {
        variables: { category_id: categoryId }
    });

    // Default to .html for when the query has not yet returned.
    const categoryUrlSuffix = (data && data.category.url_suffix) || '.html';

    // When we have breadcrumb data sort and normalize it for easy rendering.
    const normalizedData = useMemo(() => {
        if (!loading && data) {
            const breadcrumbData = data.category.breadcrumbs;

            return (
                breadcrumbData &&
                breadcrumbData.sort(sortCrumbs).map(category => ({
                    text: category.category_name,
                    path: getPath(category.category_url_path, categoryUrlSuffix)
                }))
            );
        }
    }, [categoryUrlSuffix, data, loading]);

    return {
        currentCategory: (data && data.category.name) || '',
        currentCategoryPath:
            (data && `${data.category.url_path}${categoryUrlSuffix}`) || '#',
        isLoading: loading,
        hasError: !!error,
        normalizedData: normalizedData || []
    };
};
