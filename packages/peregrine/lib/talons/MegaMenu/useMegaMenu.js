import { useMemo, useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useInternalLink from '../../hooks/useInternalLink';

import { useQuery } from '@apollo/client';
import { useEventListener } from '../../hooks/useEventListener';

import mergeOperations from '../../util/shallowMerge';
import DEFAULT_OPERATIONS from './megaMenu.gql';

/**
 * The useMegaMenu talon complements the MegaMenu component.
 *
 * @param {Object} props
 * @param {*} props.operations GraphQL operations used by talons
 * @param {React.RefObject} props.mainNavRef Reference to main navigation DOM node
 *
 * @return {MegaMenuTalonProps}
 */
export const useMegaMenu = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getMegaMenuQuery, getStoreConfigQuery } = operations;

    const location = useLocation();
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    const [subMenuState, setSubMenuState] = useState(false);
    const [disableFocus, setDisableFocus] = useState(false);

    const { data: storeConfigData } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const { data } = useQuery(getMegaMenuQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const categoryUrlSuffix = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.category_url_suffix;
        }
    }, [storeConfigData]);

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
        ({ url_path }) => {
            if (!url_path) return false;

            const categoryUrlPath = `/${url_path}${categoryUrlSuffix || ''}`;

            return location.pathname === categoryUrlPath;
        },
        [location.pathname, categoryUrlSuffix]
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
                megaMenuCategory.path = [...path, category.uid];
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

    const handleClickOutside = e => {
        if (!props.mainNavRef.current.contains(e.target)) {
            setSubMenuState(false);
            setDisableFocus(true);
        }
    };

    useEventListener(globalThis, 'keydown', handleClickOutside);

    const handleSubMenuFocus = useCallback(() => {
        setSubMenuState(true);
    }, [setSubMenuState]);

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

    /**
     * Sets next root component to show proper loading effect
     *
     * @returns {void}
     */
    const { setShimmerType } = useInternalLink('category');

    return {
        megaMenuData,
        activeCategoryId,
        categoryUrlSuffix,
        handleClickOutside,
        subMenuState,
        disableFocus,
        handleSubMenuFocus,
        handleNavigate: setShimmerType
    };
};

/** JSDocs type definitions */

/**
 * @typedef {Object} MegaMenuTalonProps
 *
 * @property {MegaMenuCategory} megaMenuData - The Object with categories contains only categories
 *                                             with the include_in_menu = 1 flag. The categories are sorted
 *                                             based on the field position.
 * @property {String} activeCategoryId returns the currently selected category uid.
 * @property {String} categoryUrlSuffix  store's category url suffix to construct category URL
 * @property {Function} handleClickOutside function to handle mouse/key events.
 * @property {Boolean} subMenuState maintaining sub-menu open/close state
 * @property {Boolean} disableFocus state to disable focus
 * @property {Function} handleSubMenuFocus toggle function to handle sub-menu focus
 * @property {function} handleNavigate - callback to fire on link click
 */

/**
 * Object type returned by the {@link useMegaMenu} talon.
 * @typedef {Object} MegaMenuCategory
 *
 * @property {String} uid - uid of the category
 * @property {int} include_in_menu - describes if category should be included in menu
 * @property {String} name - name of the category
 * @property {int} position - value used for sorting
 * @property {String} url_path - URL path for a category
 * @property {MegaMenuCategory} children - child category
 */
