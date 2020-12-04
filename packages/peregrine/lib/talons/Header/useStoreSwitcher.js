import { useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

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
            store_name: storeName
        } = store;

        const isCurrent = code === configCode;
        const option = {
            category_url_suffix,
            currency,
            isCurrent,
            locale,
            product_url_suffix,
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

export const useStoreSwitcher = props => {
    const { queries } = props;
    const {
        getStoreConfigData,
        getUrlResolverData,
        getAvailableStoresData
    } = queries;
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

    const pageType = useMemo(() => {
        if (urlResolverData && urlResolverData.urlResolver) {
            return urlResolverData.urlResolver.type;
        }
    }, [urlResolverData]);

    const availableStores = useMemo(() => {
        return (
            storeConfigData &&
            availableStoresData &&
            mapAvailableOptions(
                storeConfigData.storeConfig,
                availableStoresData.availableStores
            )
        );
    }, [storeConfigData, availableStoresData]);

    // Get suffix based on page type
    const getSuffix = useCallback(
        (storeCode, currentSuffix) => {
            let suffix = currentSuffix;

            if (pageType === 'CATEGORY') {
                suffix =
                    availableStores.get(storeCode).category_url_suffix || '';
            }
            if (pageType === 'PRODUCT') {
                suffix =
                    availableStores.get(storeCode).product_url_suffix || '';
            }

            return suffix;
        },
        [availableStores, pageType]
    );

    const handleSwitchStore = useCallback(
        // Change store view code and currency to be used in Apollo link request headers
        storeCode => {
            // Do nothing when store view is not present in available stores
            if (!availableStores.has(storeCode)) return;

            // Use window.location.pathname to get the path with the store view code
            // pathname from useLocation() does not include the store view code
            const pathName = window.location.pathname.split('.')[0];
            const index = window.location.pathname.split('.')[1];
            const currentSuffix = index ? '.' + index : '';
            const suffix = getSuffix(storeCode, currentSuffix);
            const params = window.location.search || '';

            storage.setItem('store_view_code', storeCode);
            storage.setItem(
                'store_view_currency',
                availableStores.get(storeCode).currency
            );

            // Handle updating the URL if the store code should be present.
            // Handle updating the URL with configured catalog or product URL suffix
            // In this block we use `window.location.assign` to work around the
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
                        )}${suffix}${params}`;

                        window.location.assign(newPath);
                    } else {
                        // Otherwise include it and reload.
                        const newPath = `/${storeCode}${pathName}${suffix}${params}`;

                        window.location.assign(newPath);
                    }
                } else {
                    window.location.assign(`/${storeCode}`);
                }
            } else {
                // Refresh the page to re-trigger the queries once code/currency
                // are saved in local storage.
                window.location.assign(`${pathName}${suffix}${params}`);
            }
        },
        [availableStores, getSuffix]
    );

    const handleTriggerClick = useCallback(() => {
        // Toggle Stores Menu.
        setStoreMenuIsOpen(isOpen => !isOpen);
    }, [setStoreMenuIsOpen]);

    return {
        currentStoreName,
        availableStores,
        storeMenuRef,
        storeMenuTriggerRef,
        storeMenuIsOpen,
        handleTriggerClick,
        handleSwitchStore
    };
};
