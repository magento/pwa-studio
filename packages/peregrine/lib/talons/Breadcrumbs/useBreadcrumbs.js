import { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';

// Just incase the data is unsorted, lets sort it.
const sortCrumbs = (a, b) => a.category_level > b.category_level;

// Generates the path for the category.
const getPath = (path, suffix) => {
    if (path) {
        return `/${category_url_path}${suffix}`;
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
 * @return {{ currentCategory: string, normalizedData: array }}
 */
export const useBreadcrumbs = props => {
    const { categoryId, query } = props;

    const { data, loading } = useQuery(query, {
        variables: { category_id: categoryId }
    });

    // When we have breadcrumb data sort and normalize it for easy rendering.
    const normalizedData = useMemo(() => {
        if (!loading && data) {
            const breadcrumbData = data.category.breadcrumbs;
            const categoryUrlSuffix = data.storeConfig.category_url_suffix;
            return (
                breadcrumbData &&
                breadcrumbData.sort(sortCrumbs).map(category => ({
                    text: category.category_name,
                    path: getPath(category.category_url_path, categoryUrlSuffix)
                }))
            );
        }
    }, [data, loading]);

    return {
        currentCategory: (data && data.category.name) || '',
        normalizedData: normalizedData || []
    };
};
