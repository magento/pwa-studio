import React from 'react';
import { bool, shape, string } from 'prop-types';

import { useScrollLock } from '@magento/peregrine';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './miniCart.css';

/**
 * The MiniCart component shows a limited view of the user's cart.
 *
 * @param {Boolean} props.isOpen - Whether or not the MiniCart should be displayed.
 */
const MiniCart = React.forwardRef((props, ref) => {
    const { isOpen } = props;

    // Prevent the page from scrolling in the background
    // when the MiniCart is open.
    useScrollLock(isOpen);

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;
    const contentsClass = isOpen ? classes.contents_open : classes.contents;

    return (
        <aside className={rootClass}>
            {/* The Contents. */}
            <div ref={ref} className={contentsClass}>
                <div className={classes.header}>Header TBD</div>
                <div className={classes.body}>
                    TBD
                </div>
                <div className={classes.footer}>Footer TBD</div>
            </div>
        </aside>
    );
});

export default MiniCart;

MiniCart.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        contents: string,
        contents_open: string,
        header: string,
        body: string,
        footer: string
    }),
    isOpen: bool
};
