import React from 'react';
import { bool, shape, string } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './accountMenu.css';

const MENU_ITEMS = [
    { name: 'Order History', location: '' },
    { name: 'Store Credit & Gift Cards', location: '' },
    { name: 'Favorites Lists', location: '' },
    { name: 'Address Book', location: '' },
    { name: 'Saved Payments', location: '' },
    { name: 'Communications', location: '' },
    { name: 'Account Information', location: '' },
    { name: 'Sign Out', location: '' }
];

const AccountMenu = React.forwardRef((props, ref) => {
    const { isOpen } = props;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;

    const menuItems = MENU_ITEMS.map(item => {
        return (
            <a className={classes.link} href={item.location} key={item.name}>
                {item.name}
            </a>
        );
    });

    

    return (
        <aside className={rootClass} ref={ref}>
            {menuItems}
        </aside>
    );
});

export default AccountMenu;

AccountMenu.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        link: string
    }),
    isOpen: bool
};
