import React from 'react';
import { bool, func, object, shape, string } from 'prop-types';

import Body from './body';
import Header from './header';

import { mergeClasses } from 'src/classify';
import defaultClasses from './miniCart.css';

const MiniCart = props => {
    // Props.
    const {
        beginEditItem,
        cart,
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
            <Header cart={cart} />
            <Body
                beginEditItem={beginEditItem}
                cart={cart}
                endEditItem={endEditItem}
                isCartEmpty={isCartEmpty}
                isMiniCartMaskOpen={isMiniCartMaskOpen}
                removeItemFromCart={removeItemFromCart}
                updateItemInCart={updateItemInCart}
            />
        </aside>
    );
};

MiniCart.propTypes = {
    beginEditItem: func.isRequired,
    endEditItem: func.isRequired,
    cart: object,
    classes: shape({
        header: string,
        root: string,
        root_open: string,
        title: string
    }),
    isMiniCartMaskOpen: bool,
    removeItemFromCart: func,
    updateItemInCart: func
};

export default MiniCart;
