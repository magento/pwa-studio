import { useCallback } from 'react';
import doCsrLogout from '@magento/peregrine/lib/RestApi/Csr/auth/logout';
import doLmsLogout from '@magento/peregrine/lib/RestApi/Lms/auth/logout';

/**
 * @param {Object}      props
 * @param {Function}    props.onSignOut - A function to call when sign out occurs.
 *
 * @returns {Object}    result
 * @returns {Function}  result.handleSignOut - The function to handle sign out actions.
 */
export const useAccountMenuItems = props => {
    const { onSignOut } = props;

    const handleSignOut = useCallback(() => {
        process.env.CSR_ENABLED === 'true' && doCsrLogout();
        process.env.LMS_ENABLED === 'true' && doLmsLogout();
        onSignOut();
    }, [onSignOut]);

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
            id: 'accountMenu.buyLaterNotes',
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
        }
    ];

    if (process.env.CSR_ENABLED === 'true') {
        const csrItem = {
            name: 'Support',
            id: 'accountMenu.supportLink',
            url: '/support'
        };
        MENU_ITEMS_BASIC.push(csrItem);
        MENU_ITEMS_PREMIUM.push(csrItem);
    }

    if (process.env.LMS_ENABLED === 'true') {
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
        menuItems:
            process.env.B2BSTORE_VERSION === 'BASIC'
                ? MENU_ITEMS_BASIC
                : MENU_ITEMS_PREMIUM
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
