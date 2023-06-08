import { useCallback, useState, useEffect } from 'react';
import doCsrLogout from '@magento/peregrine/lib/RestApi/Csr/auth/logout';
import doLmsLogout from '@magento/peregrine/lib/RestApi/Lms/auth/logout';

import { useModulesContext } from '../../context/modulesProvider';
import getUserCourses from '@magento/peregrine/lib/RestApi/Lms/courses/getUserCourses';
import { useUserContext } from '../../context/user';

/**
 * @param {Object}      props
 * @param {Function}    props.onSignOut - A function to call when sign out occurs.
 *
 * @returns {Object}    result
 * @returns {Function}  result.handleSignOut - The function to handle sign out actions.
 */
export const useAccountMenuItems = props => {
    const { tenantConfig } = useModulesContext();
    const { onSignOut } = props;

    const [isValidLms, setIsValidLms] = useState(false);
    const [{ isSignedIn }] = useUserContext();

    const handleSignOut = useCallback(() => {
        tenantConfig.csrEnabled && doCsrLogout();
        tenantConfig.lmsEnabled && doLmsLogout();
        onSignOut();
    }, [tenantConfig, onSignOut]);

    useEffect(() => {
        if (isSignedIn) {
            getUserCourses()
                .then(() => setIsValidLms(true))
                .catch(() => setIsValidLms(false));
        }
    }, [isSignedIn]);

    const MENU_ITEMS_BASIC = [
        {
            name: 'Account Information',
            id: 'accountMenu.accountInfoLink',
            url: '/account-information'
        },
        {
            name: 'Address Book',
            id: 'accountMenu.addressBookLink',
            url: '/address-book'
        },
        {
            name: 'Order History',
            id: 'accountMenu.orderHistoryLink',
            url: '/order-history'
        },
        {
            name: 'Favorites Lists',
            id: 'accountMenu.favoritesListsLink',
            url: '/wishlist'
        }
    ];

    const MENU_ITEMS_PREMIUM = [
        {
            name: 'Account Information',
            id: 'accountMenu.accountInfoLink',
            url: '/account-information'
        },
        {
            name: 'Address Book',
            id: 'accountMenu.addressBookLink',
            url: '/address-book'
        },
        {
            name: 'Saved carts',
            id: 'accountMenu.savedCarts',
            url: '/mpsavecart'
        },
        {
            name: 'Order History',
            id: 'accountMenu.orderHistoryLink',
            url: '/order-history'
        },
        {
            name: 'Offers',
            id: 'accountMenu.myQuotes',
            url: '/mprequestforquote/customer/quotes'
        },
        {
            name: 'Favorites Lists',
            id: 'accountMenu.favoritesListsLink',
            url: '/wishlist'
        },
        {
            name: 'Product Alerts',
            id: 'productAlert.myProductAlerts',
            url: '/productsAlert'
        },
        {
            name: 'Find a Store',
            id: 'storeLocator.findStoreText',
            url: '/find-store'
        }
    ];

    if (tenantConfig.csrEnabled) {
        const csrItem = {
            name: 'Support',
            id: 'accountMenu.supportLink',
            url: '/support'
        };
        MENU_ITEMS_BASIC.push(csrItem);
        MENU_ITEMS_PREMIUM.push(csrItem);
    }

    if (tenantConfig.lmsEnabled && isValidLms) {
        const lmsItem = {
            name: 'Learning',
            id: 'accountMenu.learningLink',
            url: '/learning'
        };
        MENU_ITEMS_BASIC.push(lmsItem);
        MENU_ITEMS_PREMIUM.push(lmsItem);
    }

    return {
        handleSignOut,
        menuItems: process.env.B2BSTORE_VERSION === 'BASIC' ? MENU_ITEMS_BASIC : MENU_ITEMS_PREMIUM
    };
};

// Hide links until features are completed
// {
//     name: 'Store Credit & Gift Cards',
//     id: 'accountMenu.storeCreditLink',
//     url: ''
// },
// {
//     name: 'Saved Payments',
//     id: 'accountMenu.savedPaymentsLink',
//     url: '/saved-payments'
// },
// {
//     name: 'Communications',
//     id: 'accountMenu.communicationsLink',
//     url: '/communications'
// },
