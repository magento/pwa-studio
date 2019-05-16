import React, { Fragment, useCallback, useState } from 'react';
import { bool, func, object, shape, string } from 'prop-types';

import { useItemBeingEdited } from '@magento/peregrine';

import EmptyMiniCart from './emptyMiniCart';
import Footer from './footer';
import ProductList from './productList';

const Body = props => {
    // Props.
    const {
        cart,
        classes,
        isCartEmpty,
        isMiniCartMaskOpen,
        openOptionsDrawer,
        removeItemFromCart
    } = props;

    if (isCartEmpty) {
        return <EmptyMiniCart />;
    }

    // State.
    const [_, setItemBeingEdited] = useItemBeingEdited();

    // Members.
    const cartId = cart.details.id;
    const currencyCode = cart.details.currency.quote_currency_code;

    // Callbacks.
    const handleOpenOptionsDrawer = useCallback(
        item => {
            console.log('setting item being edited to', item);
            setItemBeingEdited(item);
            openOptionsDrawer();
        },
        [openOptionsDrawer, setItemBeingEdited]
    );

    return (
        <Fragment>
            <div className={classes.body}>
                {cartId && (
                    <ProductList
                        currencyCode={currencyCode}
                        items={cart.details.items}
                        openOptionsDrawer={handleOpenOptionsDrawer}
                        removeItemFromCart={removeItemFromCart}
                        totalsItems={cart.totals.items}
                    />
                )}
            </div>
            <Footer
                cart={cart}
                classes={classes}
                isMiniCartMaskOpen={isMiniCartMaskOpen}
            />
        </Fragment>
    );
};

Body.propTypes = {
    cart: shape({
        details: object,
        totals: object
    }),
    classes: shape({
        footer: string,
        footerMaskOpen: string,
        summary: string
    }),
    isCartEmpty: bool,
    isMiniCartMaskOpen: bool,
    openOptionsDrawer: func.isRequired,
    removeItemFromCart: func
};

export default Body;
