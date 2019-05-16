import React from 'react';
import { bool, func, object, shape, string } from 'prop-types';
import CloseIcon from 'react-feather/dist/icons/x';

import Icon from 'src/components/Icon';
import { loadingIndicator } from 'src/components/LoadingIndicator';

import Body from './body';
import EditItem from './editItem';
import Trigger from './trigger';

import { mergeClasses } from 'src/classify';
import defaultClasses from './miniCart.css';

const MiniCart = props => {
    // Props.
    const {
        cart,
        closeOptionsDrawer,
        isCartEmpty,
        isMiniCartMaskOpen,
        isOpen,
        openOptionsDrawer,
        updateItemInCart
    } = props;
    const { isLoading, isOptionsDrawerOpen } = cart;

    // Members.
    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;
    const title = isOptionsDrawerOpen ? 'Edit Cart Item' : 'Shopping Cart';

    let contents;
    if (isLoading) {
        contents = loadingIndicator;
    } else if (isOptionsDrawerOpen) {
        contents = (
            <EditItem
                cart={cart}
                closeOptionsDrawer={closeOptionsDrawer}
                updateItemInCart={updateItemInCart}
            />
        );
    } else {
        contents = (
            <Body
                cart={cart}
                classes={classes}
                isCartEmpty={isCartEmpty}
                isMiniCartMaskOpen={isMiniCartMaskOpen}
                openOptionsDrawer={openOptionsDrawer}
            />
        );
    }

    return (
        <aside className={rootClass}>
            <div className={classes.header}>
                <h2 className={classes.title}>{title}</h2>
                <Trigger>
                    <Icon src={CloseIcon} />
                </Trigger>
            </div>
            {contents}
        </aside>
    );
};

MiniCart.propTypes = {
    cart: shape({
        isLoading: bool,
        isOptionsDrawerOpen: bool
    }),
    classes: shape({
        header: string,
        root: string,
        root_open: string,
        title: string
    }),
    closeOptionsDrawer: func.isRequired,
    isMiniCartMaskOpen: bool,
    openOptionsDrawer: func.isRequired,
    updateItemInCart: func
};

export default MiniCart;
