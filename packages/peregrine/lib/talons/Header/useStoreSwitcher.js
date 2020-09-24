import { useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

const mapAvailableOptions = (rawConfigData, rawAvailableStoresData) => {
    const { code } = rawConfigData;
    const availableOptions = {};

    rawAvailableStoresData.forEach(store => {
        availableOptions[store.code] = {
            storeName: store.store_name,
            locale: store.locale,
            is_current: store.code === code,
            currency: store.default_display_currency_code
        };
    });

    return availableOptions;
};

/**
 * The useStoreSwitcher talon complements the StoreSwitcher component.
 *
 * @param {*} props.getStoreConfig the store switcher data getStoreConfig
 *
 * @returns {Object}    talonProps.availableStores - Details about the available store views.
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
        // Change store view code and currency to be used in Appollo link request headers
        storeCode => {
            // Do nothing when store view is not present in available stores
            if (!availableStores[storeCode]) return;

            storage.setItem('store_view_code', storeCode);
            storage.setItem(
                'store_view_currency',
                availableStores[storeCode].currency
            );

            // Refresh the page to re-trigger the queries once code/currency are saved in local storage.
            history.go(0);
        },
        [history, availableStores]
    );

    const handleTriggerClick = useCallback(() => {
        // Toggle Stores Menu.
        setStoreMenuIsOpen(isOpen => !isOpen);
    }, [setStoreMenuIsOpen]);

    return {
        availableStores,
        storeMenuRef,
        storeMenuTriggerRef,
        storeMenuIsOpen,
        handleTriggerClick,
        handleSwitchStore
    };
};
