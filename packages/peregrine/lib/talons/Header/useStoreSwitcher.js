import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';

import { retrieveCartId } from '../../store/actions/cart';
import { useCartContext } from '../../context/cart';
import { clearCartDataFromCache } from '../../Apollo/clearCartDataFromCache';
import { clearCustomerDataFromCache } from '../../Apollo/clearCustomerDataFromCache';

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
    const { query, createCartMutation } = props;
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
    } = useQuery(query);

    const isLoading = getAvailableStoresDataLoading;

    const availableStores = useMemo(() => {
        let filteredData;
        if (availableStoresData) {
            filteredData = [...availableStoresData.availableStores].reduce(
                (storeViews, store) => {
                    storeViews[store.code] = {
                        storeName: store['store_name'],
                        locale: store.locale,
                        //is_current: store.code === storage.getItem('store_view').code,
                        currency: store['base_currency_code']
                    };
                    return storeViews;
                },
                {}
            );
        }

        return filteredData;
    }, [availableStoresData]);

    // Shopping cart part
    const apolloClient = useApolloClient();
    const [{ cartId }, { createCart, removeCart }] = useCartContext();
    const [fetchCartId] = useMutation(createCartMutation);

    const handleSwitchStore = useCallback(
        // Refresh shopping cart
        async storeCode => {
            const locale = availableStores[storeCode].locale;

            await storage.setItem('store_view', {
                code: storeCode,
                locale: locale,
                currency: availableStores[storeCode].currency
            });
            // Shopping cart part
            await removeCart();
            await clearCartDataFromCache(apolloClient);
            await clearCustomerDataFromCache(apolloClient);
            await removeCart();
            await createCart({
                fetchCartId
            });

            history.go(0);
        },
        [
            apolloClient,
            history,
            storage,
            availableStores,
            removeCart,
            createCart,
            fetchCartId
        ]
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
