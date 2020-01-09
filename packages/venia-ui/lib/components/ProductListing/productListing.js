import React, { useMemo } from 'react';
import { useProductListing } from '@magento/peregrine/lib/talons/ProductListing/useProductListing';

import { mergeClasses } from '../../classify';
import defaultClasses from './productListing.css';
import Product from './product';

const ProductListing = props => {
    const talonProps = useProductListing();
    const { items } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const children = useMemo(() => {
        if (items.length) {
            const productComponents = items.map(product => (
                <Product item={product} key={product.id} />
            ));

            return <ul className={classes.root}>{productComponents}</ul>;
        } else {
            return <h3>There are no items in your cart</h3>;
        }
    }, [classes.root, items]);

    return children;
};

export default ProductListing;
