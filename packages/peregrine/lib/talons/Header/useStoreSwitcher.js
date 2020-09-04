import { useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { Util } from '../../index';
const { BrowserPersistence } = Util;
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';

/**
 * The useStoreSwitcher talon complements the StoreSwitcher component.
 *
 * @param {*} props.query the store switcher data query
 *
 * @returns {Object}    talonProps.availableStores - Details about the available store views.
 * @returns {Boolean}   talonProps.storeMenuIsOpen - Whether the menu that this trigger toggles is open or not.
 * @returns {Ref}       talonProps.storeMenuRef - A React ref to the menu that this trigger toggles.
 * @returns {Ref}       talonProps.storeMenuTriggerRef - A React ref to the trigger element itself.
 * @returns {Function}  talonProps.handleTriggerClick - A function for handling when the trigger is clicked.
 * @returns {Function}  talonProps.handleSwitchStore - A function for handling when the menu item is clicked.
 */

export const useStoreSwitcher = props => {
    const { query } = props;
    const { data } = useQuery(query);
    const storage = new BrowserPersistence();
    const {
        elementRef: storeMenuRef,
        expanded: storeMenuIsOpen,
        setExpanded: setStoreMenuIsOpen,
        triggerRef: storeMenuTriggerRef
    } = useDropdown();

    const availableStores = [...data.availableStores].reduce(
        (storeViews, store) => {
            storeViews[store.code] = {
                storeName: store['store_name'],
                locale: store.locale
            };
            return storeViews;
        },
        {}
    );

    const handleTriggerClick = useCallback(() => {
        // Toggle the Account Menu.
        setStoreMenuIsOpen(isOpen => !isOpen);
    }, [setStoreMenuIsOpen]);

    const handleSwitchStore = storeCode => {
        storage.setItem('store_view_code', storeCode);
        console.log(storeCode);
    };

    return {
        availableStores,
        storeMenuRef,
        storeMenuTriggerRef,
        storeMenuIsOpen,
        handleTriggerClick,
        handleSwitchStore
    };
};
