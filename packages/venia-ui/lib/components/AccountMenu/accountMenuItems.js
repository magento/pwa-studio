import React from 'react';
import { func, shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { Link } from '@magento/venia-drivers';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { useAccountMenuItems } from '@magento/peregrine/lib/talons/AccountMenu/useAccountMenuItems';

import defaultClasses from './accountMenuItems.css';

const AccountMenuItems = props => {
    const { onSignOut } = props;

    const talonProps = useAccountMenuItems({ onSignOut });
    const { handleSignOut } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const intl = useIntl();
    const MENU_ITEMS = [
        {
            name: intl.formatMessage({ id: 'Order History' }),
            url: '/order-history'
        },
        {
            name: intl.formatMessage({ id: 'Store Credit & Gift Cards' }),
            url: ''
        },
        { name: intl.formatMessage({ id: 'Favorites Lists' }), url: '' },
        { name: intl.formatMessage({ id: 'Address Book' }), url: '' },
        { name: intl.formatMessage({ id: 'Saved Payments' }), url: '' },
        {
            name: intl.formatMessage({ id: 'Communications' }),
            url: '/communications'
        },
        { name: intl.formatMessage({ id: 'Account Information' }), url: '' }
    ];
    const menuItems = MENU_ITEMS.map(item => {
        return (
            <Link className={classes.link} key={item.name} to={item.url}>
                {item.name}
            </Link>
        );
    });

    return (
        <div className={classes.root}>
            {menuItems}
            <button
                className={classes.signOut}
                onClick={handleSignOut}
                type="button"
            >
                <FormattedMessage id={`Sign Out`} />
            </button>
        </div>
    );
};

export default AccountMenuItems;

AccountMenuItems.propTypes = {
    classes: shape({
        link: string,
        signOut: string
    }),
    onSignOut: func
};
