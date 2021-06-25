import { useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import mergeOperations from '../../util/shallowMerge';
import DEFAULT_OPERATIONS from './storeSwitcher.gql';

const storage = new BrowserPersistence();

const mapAvailableOptions = (config, stores) => {
    const { code: configCode } = config;

    return stores.reduce((map, store) => {
        const {
            category_url_suffix,
            code,
            default_display_currency_code: currency,
            locale,
            product_url_suffix,
            secure_base_media_url,
            store_group_code: storeGroupCode,
            store_group_name: storeGroupName,
            store_name: storeName,
            store_sort_order: sortOrder
        } = store;

        const isCurrent = code === configCode;
        const option = {
            category_url_suffix,
            code,
            currency,
            isCurrent,
            locale,
            product_url_suffix,
            secure_base_media_url,
            sortOrder,
            storeGroupCode,
            storeGroupName,
            storeName
        };

        return map.set(code, option);
    }, new Map());
};

/**
 * The useStoreSwitcher talon complements the StoreSwitcher component.
 *
 * @param {*} props.getStoreConfig the store switcher data getStoreConfig
 *
 * @returns {Map}    talonProps.availableStores - Details about the available store views.
 * @returns {String}    talonProps.currentStoreName - Name of the current store view.
 * @returns {Boolean}   talonProps.storeMenuIsOpen - Whether the menu that this trigger toggles is open or not.
 * @returns {Ref}       talonProps.storeMenuRef - A React ref to the menu that this trigger toggles.
 * @returns {Ref}       talonProps.storeMenuTriggerRef - A React ref to the trigger element itself.
 * @returns {Function}  talonProps.handleTriggerClick - A function for handling when the trigger is clicked.
 * @returns {Function}  talonProps.handleSwitchStore - A function for handling when the menu item is clicked.
 */

export const useStoreSwitcher = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        getStoreConfigData,
        getUrlResolverData,
        getAvailableStoresData
    } = operations;
    const { pathname } = useLocation();
    const {
        elementRef: storeMenuRef,
        expanded: storeMenuIsOpen,
        setExpanded: setStoreMenuIsOpen,
        triggerRef: storeMenuTriggerRef
    } = useDropdown();

    const { data: storeConfigData } = useQuery(getStoreConfigData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const { data: urlResolverData } = useQuery(getUrlResolverData, {
        fetchPolicy: 'cache-first',
        variables: { url: pathname }
    });

    const { data: availableStoresData } = useQuery(getAvailableStoresData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const currentStoreName = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.store_name;
        }
    }, [storeConfigData]);

    const currentGroupName = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.store_group_name;
        }
    }, [storeConfigData]);

    const currentStoreCode = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.code;
        }
    }, [storeConfigData]);

    const pageType = useMemo(() => {
        if (urlResolverData && urlResolverData.urlResolver) {
            return urlResolverData.urlResolver.type;
        }
    }, [urlResolverData]);

    // availableStores => mapped options or empty map if undefined.
    const availableStores = useMemo(() => {
        return (
            (storeConfigData &&
                availableStoresData &&
                mapAvailableOptions(
                    storeConfigData.storeConfig,
                    availableStoresData.availableStores
                )) ||
            new Map()
        );
    }, [storeConfigData, availableStoresData]);

    // Create a map of sorted store views for each group.
    const storeGroups = useMemo(() => {
        const groups = new Map();

        availableStores.forEach(store => {
            const groupCode = store.storeGroupCode;
            if (!groups.has(groupCode)) {
                const groupViews = [store];
                groups.set(groupCode, groupViews);
            } else {
                const groupViews = groups.get(groupCode);
                // Insert store at configured position
                groupViews.splice(store.sortOrder, 0, store);
            }
        });

        return groups;
    }, [availableStores]);

    // Get pathname with suffix based on page type
    const getPathname = useCallback(
        storeCode => {
            // Use globalThis.location.pathname to get the path with the store view code
            // pathname from useLocation() does not include the store view code
            const pathname = globalThis.location.pathname;

            if (pageType === 'CATEGORY') {
                const currentSuffix =
                    availableStores.get(currentStoreCode).category_url_suffix ||
                    '';
                const newSuffix =
                    availableStores.get(storeCode).category_url_suffix || '';

                return currentSuffix
                    ? pathname.replace(currentSuffix, newSuffix)
                    : `${pathname}${newSuffix}`;
            }
            if (pageType === 'PRODUCT') {
                const currentSuffix =
                    availableStores.get(currentStoreCode).product_url_suffix ||
                    '';
                const newSuffix =
                    availableStores.get(storeCode).product_url_suffix || '';

                return currentSuffix
                    ? pathname.replace(currentSuffix, newSuffix)
                    : `${pathname}${newSuffix}`;
            }

            // search.html ...etc
            return pathname;
        },
        [availableStores, currentStoreCode, pageType]
    );

    const handleSwitchStore = useCallback(
        // Change store view code and currency to be used in Apollo link request headers
        storeCode => {
            // Do nothing when store view is not present in available stores
            if (!availableStores.has(storeCode)) return;

            const pathName = getPathname(storeCode);
            const params = globalThis.location.search || '';

            storage.setItem('store_view_code', storeCode);
            storage.setItem(
                'store_view_currency',
                availableStores.get(storeCode).currency
            );
            storage.setItem(
                'store_view_secure_base_media_url',
                availableStores.get(storeCode).secure_base_media_url
            );

            // Handle updating the URL if the store code should be present.
            // In this block we use `globalThis.location.assign` to work around the
            // static React Router basename, which is changed on initialization.
            if (process.env.USE_STORE_CODE_IN_URL === 'true') {
                // Check to see if we're on a page outside of the homepage
                if (pathName !== '' && pathName !== '/') {
                    const [, pathStoreCode] = pathName.split('/');

                    // If the current store code is in the url, replace it with
                    // the new one.
                    if (
                        availableStores.has(pathStoreCode) &&
                        availableStores.get(pathStoreCode).isCurrent
                    ) {
                        const newPath = `${pathName.replace(
                            `/${pathStoreCode}`,
                            `/${storeCode}`
                        )}${params}`;

                        globalThis.location.assign(newPath);
                    } else {
                        // Otherwise include it and reload.
                        const newPath = `/${storeCode}${pathName}${params}`;

                        globalThis.location.assign(newPath);
                    }
                } else {
                    globalThis.location.assign(`/${storeCode}`);
                }
            } else {
                // Refresh the page to re-trigger the queries once code/currency
                // are saved in local storage.
                globalThis.location.assign(`${pathName}${params}`);
            }
        },
        [availableStores, getPathname]
    );

    const handleTriggerClick = useCallback(() => {
        // Toggle Stores Menu.
        setStoreMenuIsOpen(isOpen => !isOpen);
    }, [setStoreMenuIsOpen]);

    return {
        availableStores,
        currentGroupName,
        currentStoreName,
        storeGroups,
        storeMenuRef,
        storeMenuTriggerRef,
        storeMenuIsOpen,
        handleTriggerClick,
        handleSwitchStore
    };
};
