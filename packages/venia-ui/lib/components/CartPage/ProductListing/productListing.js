import React, { Fragment } from 'react';
import { useProductListing } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProductListing';

import { mergeClasses } from '../../../classify';
import LoadingIndicator from '../../LoadingIndicator';
import EditModal from './EditModal';
import defaultClasses from './productListing.css';
import Product from './product';
import { GET_PRODUCT_LISTING } from './productListing.graphql';

const ProductListing = props => {
    const talonProps = useProductListing({ query: GET_PRODUCT_LISTING });
    const {
        activeEditItem,
        isLoading,
        isUpdating,
        items,
        setActiveEditItem,
        setIsUpdating
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    if (isLoading) {
        return <LoadingIndicator>{`Fetching Cart...`}</LoadingIndicator>;
    }

    if (items.length) {
        const rootClass = isUpdating ? classes.rootMasked : classes.root;

        const productComponents = items.map(product => (
            <Product
                item={product}
                key={product.id}
                setActiveEditItem={setActiveEditItem}
                setIsUpdating={setIsUpdating}
            />
        ));

        return (
            <Fragment>
                <ul className={rootClass}>{productComponents}</ul>
                <EditModal
                    item={activeEditItem}
                    setIsUpdating={setIsUpdating}
                />
            </Fragment>
        );
    }

    return null;
};

export default ProductListing;
