import { useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';

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
    const { getStoreConfig } = props;
    const history = useHistory();
    const storage = new BrowserPersistence();
    const {
        elementRef: storeMenuRef,
        expanded: storeMenuIsOpen,
        setExpanded: setStoreMenuIsOpen,
        triggerRef: storeMenuTriggerRef
    } = useDropdown();

    const {
        data: availableStoresData,
        loading: getAvailableStoresDataLoading
    } = useQuery(getStoreConfig, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const isLoading = getAvailableStoresDataLoading;

    const availableStores = useMemo(() => {
        let filteredData;
        if (availableStoresData) {
            filteredData = [...availableStoresData.availableStores].reduce(
                (storeViews, store) => {
                    storeViews[store.code] = {
                        storeName: store['store_name'],
                        locale: store.locale,
                        is_current:
                            store.code === availableStoresData.storeConfig.code,
                        currency: store['default_display_currency']
                    };
                    return storeViews;
                },
                {}
            );
        }

        return filteredData;
    }, [availableStoresData]);

    const handleSwitchStore = useCallback(
        // Change store view code and currency to be used in Appollo link request headers
        async storeCode => {
            await storage.setItem('store_view', {
                code: storeCode,
                currency: availableStores[storeCode].currency
            });

            // Refresh the page to re-trigger the queries once code/currency are saved in local storage.
            history.go(0);
        },
        [history, storage, availableStores]
    );

    const handleTriggerClick = useCallback(() => {
        // Toggle the Account Menu.
        setStoreMenuIsOpen(isOpen => !isOpen);
    }, [setStoreMenuIsOpen]);

    return {
        availableStores,
        storeMenuRef,
        storeMenuTriggerRef,
        storeMenuIsOpen,
        handleTriggerClick,
        handleSwitchStore,
        isLoading
    };
};
