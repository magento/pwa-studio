import React, { useMemo } from 'react';
import { string, func, arrayOf, shape, number, oneOf } from 'prop-types';

import Item from './item';
import { useStyle } from '../../../classify';

import defaultClasses from './productList.module.css';

const ProductList = props => {
    const {
        items,
        handleRemoveItem,
        classes: propClasses,
        closeMiniCart,
        configurableThumbnailSource,
        storeUrlSuffix,
        totalQuantity
    } = props;
    const classes = useStyle(defaultClasses, propClasses);

    const cartItems = useMemo(() => {
        if (items) {
            return items.map(item => (
                <Item
                    key={item.uid}
                    {...item}
                    closeMiniCart={closeMiniCart}
                    handleRemoveItem={handleRemoveItem}
                    configurableThumbnailSource={configurableThumbnailSource}
                    storeUrlSuffix={storeUrlSuffix}
                    totalQuantity={totalQuantity}
                />
            ));
        }
    }, [
        items,
        handleRemoveItem,
        closeMiniCart,
        configurableThumbnailSource,
        storeUrlSuffix,
        totalQuantity
    ]);

    return (
        <div className={classes.root} data-cy="MiniCart-ProductList-root">
            {cartItems}
        </div>
    );
};

export default ProductList;

ProductList.propTypes = {
    classes: shape({ root: string }),
    items: arrayOf(
        shape({
            product: shape({
                name: string,
                thumbnail: shape({
                    url: string
                })
            }),
            id: string,
            quantity: number,
            configurable_options: arrayOf(
                shape({
                    label: string,
                    value: string
                })
            ),
            prices: shape({
                price: shape({
                    value: number,
                    currency: string
                })
            }),
            configured_variant: shape({
                thumbnail: shape({
                    url: string
                })
            })
        })
    ),
    configurableThumbnailSource: oneOf(['parent', 'itself']),
    handleRemoveItem: func
};
