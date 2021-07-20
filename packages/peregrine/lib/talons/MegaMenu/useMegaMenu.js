import mergeOperations from '../../util/shallowMerge';
import DEFAULT_OPERATIONS from './megaMenu.gql';
import { useQuery } from '@apollo/client';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * The useMegaMenu talon complements the MegaMenu component.
 *
 * @param {Object} props
 * @param {*} props.operations GraphQL operations used by talons
 *
 * @return {MegaMenuTalonProps}
 */
export const useMegaMenu = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getMegaMenuQuery } = operations;

    const location = useLocation();
    const [activeCategoryId, setActiveCategoryId] = useState(null);

    const { data } = useQuery(getMegaMenuQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    /**
     * Check if category should be visible on the storefront.
     *
     * @param {MegaMenuCategory} category
     * @returns {boolean}
     */
    const shouldRenderMegaMenuItem = category => {
        return !!category.include_in_menu;
    };

    /**
     * Check if category is the active category based on the current location.
     *
     * @param {MegaMenuCategory} category
     * @returns {boolean}
     */
    const isActive = useCallback(
        ({ url_path, url_suffix }) => {
            if (!url_path) return false;

            const categoryUrlPath = `/${url_path}${url_suffix || ''}`;

            return location.pathname === categoryUrlPath;
        },
        [location.pathname]
    );

    /**
     * Recursively map data returned by GraphQL query.
     *
     * @param {MegaMenuCategory} category
     * @param {array} - path from the given category to the first level category
     * @param {boolean} isRoot - describes is category a root category
     * @return {MegaMenuCategory}
     */
    const processData = useCallback(
        (category, path = [], isRoot = true) => {
            if (!category) {
                return;
            }

            const megaMenuCategory = Object.assign({}, category);

            if (!isRoot) {
                megaMenuCategory.path = [...path, category.id];
            }

            megaMenuCategory.isActive = isActive(megaMenuCategory);

            if (megaMenuCategory.children) {
                megaMenuCategory.children = [...megaMenuCategory.children]
                    .filter(category => shouldRenderMegaMenuItem(category))
                    .sort((a, b) => (a.position > b.position ? 1 : -1))
                    .map(child =>
                        processData(child, megaMenuCategory.path, false)
                    );
            }

            return megaMenuCategory;
        },
        [isActive]
    );

    const megaMenuData = useMemo(() => {
        return data ? processData(data.categoryList[0]) : {};
    }, [data, processData]);

    const findActiveCategory = useCallback(
        (pathname, category) => {
            if (isActive(category)) {
                return category;
            }

            if (category.children) {
                return category.children.find(category =>
                    findActiveCategory(pathname, category)
                );
            }
        },
        [isActive]
    );

    useEffect(() => {
        const activeCategory = findActiveCategory(
            location.pathname,
            megaMenuData
        );

        if (activeCategory) {
            setActiveCategoryId(activeCategory.path[0]);
        } else {
            setActiveCategoryId(null);
        }
    }, [findActiveCategory, location.pathname, megaMenuData]);

    return {
        megaMenuData,
        activeCategoryId
    };
};

/** JSDocs type definitions */

/**
 * @typedef {Object} MegaMenuTalonProps
 *
 * @property {MegaMenuCategory} megaMenuData - The Object with categories contains only categories
 *                                             with the include_in_menu = 1 flag. The categories are sorted
 *                                             based on the field position.
 * @property {int} loading whether the regions are loading
 *
 */

/**
 * Object type returned by the {@link useMegaMenu} talon.
 * @typedef {Object} MegaMenuCategory
 *
 * @property {int} id - id of the category
 * @property {int} include_in_menu - describes if category should be included in menu
 * @property {String} name - name of the category
 * @property {int} position - value used for sorting
 * @property {String} url_path - URL path for a category
 * @property {String} url_suffix - URL Suffix for the category
 * @property {MegaMenuCategory} children - child category
 */
