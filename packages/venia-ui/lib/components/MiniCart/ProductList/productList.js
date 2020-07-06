import React, { useMemo } from 'react';
import { string, func, arrayOf, shape, bool, number } from 'prop-types';

import LoadingIndicator from '../../LoadingIndicator';
import Item from './item';
import { mergeClasses } from '../../../classify';

import defaultClasses from './productList.css';

const ProductList = props => {
    const { items, loading, handleRemoveItem, classes: propClasses } = props;
    const classes = mergeClasses(defaultClasses, propClasses);

    const cartItems = useMemo(() => {
        if (!loading && items) {
            return items.map(item => (
                <Item
                    key={item.id}
                    {...item}
                    handleRemoveItem={handleRemoveItem}
                />
            ));
        }
    }, [items, loading, handleRemoveItem]);

    if (loading) {
        return <LoadingIndicator>{`Fetching Items in Cart`}</LoadingIndicator>;
    }

    return <div className={classes.root}>{cartItems}</div>;
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
            })
        })
    ),
    loading: bool,
    handleRemoveItem: func
};
