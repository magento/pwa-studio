import React, { Fragment } from 'react';
import { Lock as LockIcon } from 'react-feather';
import { bool, shape, string } from 'prop-types';

import { useScrollLock, Price } from '@magento/peregrine';
import { useMiniCart } from '@magento/peregrine/lib/talons/MiniCart/useMiniCart';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import Button from '../Button';
import Icon from '../Icon';
import ProductList from './ProductList';

import MiniCartOperations from './miniCart.gql';

import defaultClasses from './miniCart.css';

const Error = () => {
    return <div>TBD</div>;
};

/**
 * The MiniCart component shows a limited view of the user's cart.
 *
 * @param {Boolean} props.isOpen - Whether or not the MiniCart should be displayed.
 */
const MiniCart = React.forwardRef((props, ref) => {
    const { isOpen, setIsOpen } = props;

    // Prevent the page from scrolling in the background
    // when the MiniCart is open.
    useScrollLock(isOpen);

    const talonProps = useMiniCart({
        setIsOpen,
        ...MiniCartOperations
    });

    const {
        productList,
        loading,
        error,
        totalQuantity,
        subTotal,
        handleRemoveItem,
        handleEditCart,
        handleProceedToCheckout
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;
    const contentsClass = isOpen ? classes.contents_open : classes.contents;
    const isCartEmpty = !(productList && productList.length);

    if (error) {
        return <Error error={error} />;
    }

    const header =
        loading || !subTotal ? (
            'Loading...'
        ) : (
            <Fragment>
                <span>{`${totalQuantity} Items`}</span>
                <span className={classes.price}>
                    <span>{'Subtotal: '}</span>
                    <Price
                        currencyCode={subTotal.currency}
                        value={subTotal.value}
                    />
                </span>
            </Fragment>
        );

    const contents = isCartEmpty ? (
        <div className={classes.empty_cart}>
            <div className={classes.empty_message}>
                There are no items in your cart.
            </div>
        </div>
    ) : (
        <Fragment>
            <div className={classes.header}>{header}</div>
            <div className={classes.body}>
                <ProductList
                    items={productList}
                    loading={loading}
                    handleRemoveItem={handleRemoveItem}
                />
            </div>
            <div className={classes.footer}>
                <Button
                    onClick={handleProceedToCheckout}
                    priority="high"
                    className={classes.checkout_button}
                    disabled={loading || isCartEmpty}
                >
                    <Icon
                        size={16}
                        src={LockIcon}
                        classes={{ icon: classes.checkout_icon }}
                    />
                    {'SECURE CHECKOUT'}
                </Button>
                <Button
                    onClick={handleEditCart}
                    priority="high"
                    className={classes.edit_cart_button}
                    disabled={loading || isCartEmpty}
                >
                    {'Edit Shopping Bag'}
                </Button>
            </div>
        </Fragment>
    );

    return (
        <aside className={rootClass}>
            <div ref={ref} className={contentsClass}>
                {contents}
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
