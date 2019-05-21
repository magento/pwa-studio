import React from 'react';
import { bool, func, shape, string } from 'prop-types';

import Body from './body';
import Header from './header';

import { mergeClasses } from 'src/classify';
import defaultClasses from './miniCart.css';

const MiniCart = props => {
    // Props.
    const {
        beginEditItem,
        cart,
        closeDrawer,
        endEditItem,
        isCartEmpty,
        isMiniCartMaskOpen,
        isOpen,
        removeItemFromCart,
        updateItemInCart
    } = props;

    // Members.
    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;

    return (
        <aside className={rootClass}>
            <Header 
                closeDrawer={closeDrawer}
                isEditingItem={cart.isEditingItem}
            />
            <Body
                beginEditItem={beginEditItem}
                cart={cart}
                endEditItem={endEditItem}
                isCartEmpty={isCartEmpty}
                isMiniCartMaskOpen={isMiniCartMaskOpen}
                removeItemFromCart={removeItemFromCart}
                updateItemInCart={updateItemInCart}
            />
            { /* Note: A footer only appears when the ProductList
               * component is visible. As such, the footer component
               * now lives in ProductList.
            */ }
        </aside>
    );
};

MiniCart.propTypes = {
    beginEditItem: func.isRequired,
    cart: shape({
        isEditingItem: bool,
    }).isRequired,
    classes: shape({
        header: string,
        root: string,
        root_open: string,
        title: string
    }),
    closeDrawer: func,
    endEditItem: func.isRequired,
    isCartEmpty: bool,
    isMiniCartMaskOpen: bool,
    isOpen: bool,
    removeItemFromCart: func,
    updateItemInCart: func
};

export default MiniCart;
