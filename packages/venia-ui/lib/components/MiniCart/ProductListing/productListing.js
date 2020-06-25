import React, { useMemo } from 'react';

import LoadingIndicator from '../../LoadingIndicator';
import Item from './item';
import { mergeClasses } from '../../../classify';

import defaultClasses from './productListing.css';

const ProductListing = props => {
    const { listings, loading, handleRemoveItem, classes: propClasses } = props;
    const classes = mergeClasses(defaultClasses, propClasses);

    const items = useMemo(() => {
        if (!loading && listings) {
            return listings.map(item => (
                <Item
                    key={item.id}
                    {...item}
                    handleRemoveItem={handleRemoveItem}
                />
            ));
        }
    }, [listings, loading, handleRemoveItem]);

    if (loading) {
        return <LoadingIndicator>{`Fetching Items in Cart`}</LoadingIndicator>;
    }

    return <div className={classes.root}>{items}</div>;
};

export default ProductListing;
