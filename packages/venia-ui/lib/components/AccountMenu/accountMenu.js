import React from 'react';
import { bool, func, shape, string } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import AccountMenuItems from './accountMenuItems';
import defaultClasses from './accountMenu.css';

const AccountMenu = React.forwardRef((props, ref) => {
    const { handleSignOut, isOpen, isUserSignedIn } = props;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;
    const dropdownContents = isUserSignedIn ? (
        <AccountMenuItems handleSignOut={handleSignOut} />
    ) : (
        'Sign In TBD (PWA-625)'
    );

    return (
        <aside className={rootClass} ref={ref}>
            {dropdownContents}
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
    handleSignOut: func,
    isOpen: bool,
    isUserSignedIn: bool
};
