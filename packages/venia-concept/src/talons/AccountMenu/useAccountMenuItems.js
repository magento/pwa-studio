import { useCallback } from 'react';
import doCsrLogout from '@orienteed/csr/services/auth/logout';

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
        doCsrLogout();
        onSignOut();
    }, [onSignOut]);

    const MENU_ITEMS = [
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
            name: 'Buy Later Notes',
            id: 'accountMenu.buyLaterNotes',
            url: '/mpsavecart'
        },
        {
            name: 'Order History',
            id: 'accountMenu.orderHistoryLink',
            url: '/order-history'
        },
        {
            name: 'My Quotes',
            id: 'accountMenu.myQuotes',
            url: '/mprequestforquote/customer/quotes'
        },
        {
            name: 'Favorites Lists',
            id: 'accountMenu.favoritesListsLink',
            url: '/wishlist'
        },
        {
            name: 'Support',
            id: 'accountMenu.supportLink',
            url: '/support'
        },
        {
            name: 'Learning',
            id: 'accountMenu.learningLink',
            url: '/learning'
        }
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
    ];

    return {
        handleSignOut,
        menuItems: MENU_ITEMS
    };
};
