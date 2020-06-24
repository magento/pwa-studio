import React from 'react';
import { bool, func, shape, string } from 'prop-types';

import { useScrollLock } from '@magento/peregrine';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './shoppingBag.css';

/**
 * The ShoppingBag component shows a limited view of the user's cart.
 * 
 * @param {Boolean} props.isOpen - Whether or not the ShoppingBag should be displayed.
 */
const ShoppingBag = React.forwardRef((props, ref) => {
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
                    {Array(40).fill(<div>Items List TBD</div>)}
                </div>
                <div className={classes.footer}>Footer TBD</div>
            </div>
        </aside>
    );
});

export default ShoppingBag;

ShoppingBag.propTypes = {
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
