import React from 'react';
import { bool, func, shape, string } from 'prop-types';

import { useScrollLock } from '@magento/peregrine';
import { useMiniCart2 } from '@magento/peregrine/lib/talons/MiniCart2/useMiniCart2';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './minicart.css';

/**
 * The MiniCart component shows a small overview of the user's
 * cart on desktop only.
 *
 * @param {*} props
 */
const MiniCart = props => {
    const { isOpen, setIsOpen } = props;

    // Prevent the page from scrolling in the background
    // when the MiniCart is open.
    useScrollLock(isOpen);

    const talonProps = useMiniCart2({
        setIsOpen
    });

    const { onDismiss } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;

    return (
        <aside className={rootClass}>
            {/* The Mask. */}
            <button className={classes.mask} onClick={onDismiss} type="reset" />
            {/* The Contents. */}
            <div className={classes.contents}>
                <div className={classes.header}>Header TBD</div>
                <div className={classes.body}>
                    Items List TBD <br />
                    Items List TBD <br />
                    Items List TBD <br />
                    Items List TBD <br />
                    Items List TBD <br />
                    Items List TBD <br />
                    Items List TBD <br />
                    Items List TBD <br />
                    Items List TBD <br />
                    Items List TBD <br />
                    Items List TBD <br />
                    Items List TBD <br />
                    Items List TBD <br />
                    Items List TBD <br />
                    Items List TBD <br />
                    Items List TBD <br />
                    Items List TBD <br />
                    Items List TBD <br />
                    Items List TBD <br />
                </div>
                <div className={classes.footer}>Footer TBD</div>
            </div>
        </aside>
    );
};

export default MiniCart;

MiniCart.propTypes = {
    classes: shape({
        root: string
    }),
    isOpen: bool,
    setIsOpen: func
};
