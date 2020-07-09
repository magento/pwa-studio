import React from 'react';
import { bool, shape, string } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './accountMenu.css';

const AccountMenu = React.forwardRef((props, ref) => {
    const { isOpen } = props;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;

    return (
        <aside className={rootClass} ref={ref}>
            <div key={1}>Item 1</div>
            <div key={2}>Item 2</div>
            <div key={3}>Item 3</div>
            <hr key={5} />
            <div key={4}>Sign In</div>
        </aside>
    );
});

export default AccountMenu;

AccountMenu.propTypes = {
    classes: shape({
        root: string,
        root_open: string
    }),
    isOpen: bool
};
