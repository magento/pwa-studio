import React from 'react';
import gql from 'graphql-tag';
import { useProductListing } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProductListing';

import { mergeClasses } from '../../../classify';
import LoadingIndicator from '../../LoadingIndicator';
import defaultClasses from './productListing.css';
import Product from './product';
import { ProductListingFragment } from './productListingFragments';

const ProductListing = props => {
    const talonProps = useProductListing({ query: GET_PRODUCT_LISTING });
    const { isLoading, items } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    if (isLoading) {
        return <LoadingIndicator>{`Fetching Cart...`}</LoadingIndicator>;
    }

    if (items.length) {
        const productComponents = items.map(product => (
            <Product item={product} key={product.id} />
        ));

        return <ul className={classes.root}>{productComponents}</ul>;
    }

    return null;
};

export const GET_PRODUCT_LISTING = gql`
    query getProductListing($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...ProductListingFragment
        }
    }
    ${ProductListingFragment}
`;

export default ProductListing;
