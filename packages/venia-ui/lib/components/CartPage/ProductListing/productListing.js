import React, { Fragment } from 'react';
import gql from 'graphql-tag';
import { useProductListing } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProductListing';

import { mergeClasses } from '../../../classify';
import LoadingIndicator from '../../LoadingIndicator';
import EditModal from './EditModal';
import defaultClasses from './productListing.css';
import Product from './product';
import { ProductListingFragment } from './productListingFragments';

const ProductListing = props => {
    const { setIsCartUpdating } = props;
    const talonProps = useProductListing({
        queries: {
            getProductListing: GET_PRODUCT_LISTING
        }
    });
    const { activeEditItem, isLoading, items, setActiveEditItem } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    if (isLoading) {
        return <LoadingIndicator>{`Fetching Cart...`}</LoadingIndicator>;
    }

    if (items.length) {
        const productComponents = items.map(product => (
            <Product
                item={product}
                key={product.id}
                setActiveEditItem={setActiveEditItem}
                setIsCartUpdating={setIsCartUpdating}
            />
        ));

        return (
            <Fragment>
                <ul className={classes.root}>{productComponents}</ul>
                <EditModal
                    item={activeEditItem}
                    setIsCartUpdating={setIsCartUpdating}
                />
            </Fragment>
        );
    }

    return null;
};

export const GET_PRODUCT_LISTING = gql`
    query getProductListing($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            ...ProductListingFragment
        }
    }
    ${ProductListingFragment}
`;

export default ProductListing;
