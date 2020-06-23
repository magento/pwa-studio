import React from 'react';
import { bool, func, shape, string } from 'prop-types';

import { useScrollLock } from '@magento/peregrine';
import { useShoppingBag } from '@magento/peregrine/lib/talons/ShoppingBag/useShoppingBag';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import ProductListing from './ProductListing';

import ShoppingBadOperations from './shoppingBag.gql';

import defaultClasses from './shoppingBag.css';

const Error = () => {
    return <div>TBD</div>;
};

/**
 * The ShoppingBag component shows a limited view of the user's cart.
 *
 * @param {Boolean}     props.isOpen - Whether or not the ShoppingBag is open.
 * @param {Function}    props.setIsOpen - Toggle whether or not the ShoppingBag is open.
 */
const ShoppingBag = props => {
    const { isOpen, setIsOpen } = props;

    // Prevent the page from scrolling in the background
    // when the MiniCart is open.
    useScrollLock(isOpen);

    const talonProps = useShoppingBag({
        setIsOpen,
        ...ShoppingBadOperations
    });

    const {
        onDismiss,
        productListings,
        loading,
        error,
        totalQuantity,
        handleRemoveItem
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;

    if (error) {
        return <Error error={error} />;
    }

    return (
        <aside className={rootClass}>
            {/* The Mask. */}
            <button className={classes.mask} onClick={onDismiss} type="reset" />
            {/* The Contents. */}
            <div className={classes.contents}>
                <div
                    className={classes.header}
                >{`Header TBD total quantity: ${totalQuantity}`}</div>
                <div className={classes.body}>
                    <ProductListing
                        listings={productListings}
                        loading={loading}
                        handleRemoveItem={handleRemoveItem}
                    />
                </div>
                <div className={classes.footer}>Footer TBD</div>
            </div>
        </aside>
    );
};

export default ShoppingBag;

ShoppingBag.propTypes = {
    classes: shape({
        root: string
    }),
    isOpen: bool,
    setIsOpen: func
};
