import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { func, shape, string } from 'prop-types';

import { Link } from '@magento/venia-drivers';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './accountMenuItems.css';

const AccountMenuItems = props => {
    const { handleSignOut } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    const intl = useIntl();
    const MENU_ITEMS = [
        { name: intl.formatMessage({ id: 'Order History' }), url: '' },
        {
            name: intl.formatMessage({ id: 'Store Credit & Gift Cards' }),
            url: ''
        },
        { name: intl.formatMessage({ id: 'Favorites Lists' }), url: '' },
        { name: intl.formatMessage({ id: 'Address Book' }), url: '' },
        { name: intl.formatMessage({ id: 'Saved Payments' }), url: '' },
        { name: intl.formatMessage({ id: 'Communications' }), url: '' },
        { name: intl.formatMessage({ id: 'Account Information' }), url: '' }
    ];
    const menuItems = MENU_ITEMS.map(item => {
        return (
            <Link className={classes.link} to={item.url} key={item.name}>
                {item.name}
            </Link>
        );
    });

    return (
        <Fragment>
            {menuItems}
            <button
                className={classes.signOut}
                onClick={handleSignOut}
                type="button"
            >
                <FormattedMessage id={'Sign Out'} />
            </button>
        </Fragment>
    );
};

export default AccountMenuItems;

AccountMenuItems.propTypes = {
    classes: shape({
        link: string,
        signOut: string
    }),
    handleSignOut: func
};
