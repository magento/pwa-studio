import { useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

const mapAvailableOptions = (config, stores) => {
    const { code: configCode } = config;

    return stores.reduce((map, store) => {
        const {
            code,
            default_display_currency_code: currency,
            locale,
            store_name: storeName
        } = store;

        const isCurrent = code === configCode;
        const option = { currency, isCurrent, locale, storeName };

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
    const { getStoreConfigData, getAvailableStoresData } = queries;
    const history = useHistory();
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

    const { data: availableStoresData } = useQuery(getAvailableStoresData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const currentStoreName = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.store_name;
        }
    }, [storeConfigData]);

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

    const handleSwitchStore = useCallback(
        // Change store view code and currency to be used in Apollo link request headers
        storeCode => {
            // Do nothing when store view is not present in available stores
            if (!availableStores.has(storeCode)) return;

            storage.setItem('store_view_code', storeCode);
            storage.setItem(
                'store_view_currency',
                availableStores.get(storeCode).currency
            );

            // Handle updating the URL if the store code should be present.
            // In this block we use `window.location.assign` to work around the
            // static React Router basename, which is changed on initialization.
            if (process.env.USE_STORE_CODE_IN_URL === 'true') {
                const pathName = window.location.pathname;
                const params = window.location.search || '';

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

                        window.location.assign(newPath);
                    } else {
                        // Otherwise include it and reload.
                        const newPath = `/${storeCode}${pathName}${params}`;

                        window.location.assign(newPath);
                    }
                } else {
                    window.location.assign(`/${storeCode}`);
                }
            } else {
                // Refresh the page to re-trigger the queries once code/currency
                // are saved in local storage.
                history.go(0);
            }
        },
        [history, availableStores]
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
