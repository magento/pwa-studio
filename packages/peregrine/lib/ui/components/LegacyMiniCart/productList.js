import React, { useMemo } from 'react';
import { array, func, shape, string } from 'prop-types';

import { useStyle } from '../../classify';

import Product from './product';
import defaultClasses from './productList.module.css';

const ProductList = props => {
    const { beginEditItem, cartItems, currencyCode } = props;

    const products = useMemo(
        () =>
            cartItems.map(product => {
                return (
                    <Product
                        beginEditItem={beginEditItem}
                        currencyCode={currencyCode}
                        item={product}
                        key={product.id}
                    />
                );
            }),
        [beginEditItem, cartItems, currencyCode]
    );

    const classes = useStyle(defaultClasses, props.classes);

    return <ul className={classes.root}>{products}</ul>;
};

ProductList.propTypes = {
    beginEditItem: func,
    cartItems: array,
    classes: shape({
        root: string
    }),
    currencyCode: string
};

export default ProductList;
