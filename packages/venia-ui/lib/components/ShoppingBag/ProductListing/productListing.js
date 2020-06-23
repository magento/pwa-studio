import React, { useMemo } from 'react';

import LoadingIndicator from '../../LoadingIndicator';
import Item from './item';

const ProductListing = props => {
    const { listings, loading } = props;

    const items = useMemo(() => {
        if (!loading && listings) {
            return listings.map(item => <Item key={item.id} {...item} />);
        }
    }, [listings, loading]);

    if (loading) {
        return <LoadingIndicator>{`Fetching Items in Cart`}</LoadingIndicator>;
    }

    return <div>{items}</div>;
};

export default ProductListing;
