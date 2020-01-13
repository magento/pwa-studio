import React from 'react';
import gql from 'graphql-tag';
import { useProductListing } from '@magento/peregrine/lib/talons/ProductListing/useProductListing';

import { mergeClasses } from '../../classify';
import LoadingIndicator from '../LoadingIndicator';
import defaultClasses from './productListing.css';
import Product from './product';

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
    } else {
        return <h3>There are no items in your cart.</h3>;
    }
};

ProductListing.fragments = {
    cart: gql`
        fragment CartBody on Cart {
            id
            items {
                id
                product {
                    name
                    small_image {
                        url
                    }
                }
                prices {
                    price {
                        currency
                        value
                    }
                }
                quantity
                ... on ConfigurableCartItem {
                    configurable_options {
                        option_label
                        value_label
                    }
                }
            }
        }
    `
};

export default ProductListing;

// Export query to be used by other components that may need to trigger
// a full re-fetch.
export const GET_PRODUCT_LISTING = gql`
    query getProductListing($cartId: String!) {
        cart(cart_id: $cartId) {
            ...CartBody
        }
        ${ProductListing.fragments.cart}
    }
`;

export const REMOVE_ITEM_MUTATION = gql`
    mutation remoteItem($cartId: String!, $itemId: Int!) {
        removeItemFromCart(input: { cart_id: $cartId, cart_item_id: $itemId }) {
            cart {
                ...CartBody
            }
        }
        ${ProductListing.fragments.cart}
    }
`;
