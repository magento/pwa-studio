import React, { useEffect } from 'react';
import { bool, shape, string } from 'prop-types';
import { AlertCircle as AlertCircleIcon } from 'react-feather';

import { useScrollLock, useToasts } from '@magento/peregrine';
import { useMiniCart } from '@magento/peregrine/lib/talons/MiniCart/useMiniCart';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import Icon from '../Icon';
import ProductList from './ProductList';

import MiniCartOperations from './miniCart.gql';

import defaultClasses from './miniCart.css';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

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

    const talonProps = useMiniCart({
        ...MiniCartOperations
    });

    const {
        productList,
        loading,
        errors,
        totalQuantity,
        handleRemoveItem
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;
    const contentsClass = isOpen ? classes.contents_open : classes.contents;

    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (errors && errors.length) {
            const message = errors.join(', ');

            addToast({
                type: 'error',
                icon: errorIcon,
                message,
                dismissable: true,
                timeout: 7000
            });

            if (process.env.NODE_ENV !== 'production') {
                console.error(message);
            }
        }
    }, [addToast, errors]);

    return (
        <aside className={rootClass}>
            {/* The Contents. */}
            <div ref={ref} className={contentsClass}>
                <div
                    className={classes.header}
                >{`Header TBD total quantity: ${totalQuantity}`}</div>
                <div className={classes.body}>
                    <ProductList
                        items={productList}
                        loading={loading}
                        handleRemoveItem={handleRemoveItem}
                    />
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
