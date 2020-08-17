import React from 'react';
import { func, shape, string } from 'prop-types';

import { Link } from '@magento/venia-drivers';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './accountMenuItems.css';

const MENU_ITEMS = [
    { name: 'Order History', url: '' },
    { name: 'Store Credit & Gift Cards', url: '' },
    { name: 'Favorites Lists', url: '/wishlist' },
    { name: 'Address Book', url: '' },
    { name: 'Saved Payments', url: '' },
    { name: 'Communications', url: '/communications' },
    { name: 'Account Information', url: '' }
];

const AccountMenuItems = props => {
    const { onSignOut, onClose } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    const menuItems = MENU_ITEMS.map(item => {
        return (
            <Link
                className={classes.link}
                to={item.url}
                key={item.name}
                onClick={onClose}
            >
                {item.name}
            </Link>
        );
    });

    return (
        <div className={classes.root}>
            {menuItems}
            <button
                className={classes.signOut}
                onClick={onSignOut}
                type="button"
            >{`Sign Out`}</button>
        </div>
    );
};

export default AccountMenuItems;

AccountMenuItems.propTypes = {
    classes: shape({
        link: string,
        signOut: string
    }),
    onClose: func,
    onSignOut: func
};
