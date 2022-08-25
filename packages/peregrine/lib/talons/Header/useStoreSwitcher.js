import { useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import mergeOperations from '../../util/shallowMerge';
import DEFAULT_OPERATIONS from './storeSwitcher.gql';

const storage = new BrowserPersistence();

const mapAvailableOptions = (config, stores) => {
    const { store_code: configCode } = config;

    return stores.reduce((map, store) => {
        const {
            default_display_currency_code: currency,
            locale,
            secure_base_media_url,
            store_code: storeCode,
            store_group_code: storeGroupCode,
            store_group_name: storeGroupName,
            store_name: storeName,
            store_sort_order: sortOrder
        } = store;

        const isCurrent = storeCode === configCode;
        const option = {
            currency,
            isCurrent,
            locale,
            secure_base_media_url,
            sortOrder,
            storeCode,
            storeGroupCode,
            storeGroupName,
            storeName
        };

        return map.set(storeCode, option);
    }, new Map());
};

/**
 * The useStoreSwitcher talon complements the StoreSwitcher component.
 *
 * @param {Array<Object>} [props.availableRoutes] - Hardcoded app routes.
 * @param {Object} [props.operations] - GraphQL operations to be run by the hook.
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
    const { availableRoutes = [] } = props;
    const internalRoutes = useMemo(() => {
        return availableRoutes.map(path => {
            if (path.exact) {
                return path.pattern;
            }
        });
    }, [availableRoutes]);

    const {
        getStoreConfigData,
        getRouteData,
        getAvailableStoresData
    } = operations;
    const { pathname, search: searchParams } = useLocation();
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

    const fetchRouteData = useAwaitQuery(getRouteData);

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

    const getPathname = useCallback(
        async storeCode => {
            if (pathname === '' || pathname === '/') return '';
            let newPath = '';
            if (internalRoutes.includes(pathname)) {
                newPath = pathname;
            } else {
                const { data: routeData } = await fetchRouteData({
                    fetchPolicy: 'no-cache',
                    variables: {
                        url: pathname
                    },
                    context: { headers: { store: storeCode } }
                });
                if (routeData.route) {
                    newPath = routeData.route.relative_url;
                }
            }
            return newPath.startsWith('/') ? newPath.substr(1) : newPath;
        },
        [pathname, fetchRouteData, internalRoutes]
    );

    const handleSwitchStore = useCallback(
        // Change store view code and currency to be used in Apollo link request headers
        async storeCode => {
            // Do nothing when store view is not present in available stores
            if (!availableStores.has(storeCode)) return;

            storage.setItem('store_view_code', storeCode);
            storage.setItem(
                'store_view_currency',
                availableStores.get(storeCode).currency
            );
            storage.setItem(
                'store_view_secure_base_media_url',
                availableStores.get(storeCode).secure_base_media_url
            );
            const pathName = await getPathname(storeCode);
            const newPath = pathName ? `/${pathName}${searchParams}` : '';

            if (process.env.USE_STORE_CODE_IN_URL === 'true') {
                globalThis.location.assign(`/${storeCode}${newPath || ''}`);
            } else {
                globalThis.location.assign(`${newPath || '/'}`);
            }
        },
        [availableStores, getPathname, searchParams]
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
