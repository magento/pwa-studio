import React from 'react';
import { arrayOf, func, number, oneOfType, shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import mapProduct from '../../util/mapProduct';
import SuggestedProduct from './suggestedProduct';
import defaultClasses from './suggestedProducts.module.css';

const SuggestedProducts = props => {
    const { limit, onNavigate, products } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const items = products.slice(0, limit).map(product => (
        <li key={product.id} className={classes.item}>
            <SuggestedProduct
                {...mapProduct(product)}
                onNavigate={onNavigate}
            />
        </li>
    ));

    return <ul className={classes.root}>{items}</ul>;
};

export default SuggestedProducts;

SuggestedProducts.defaultProps = {
    limit: 3
};

SuggestedProducts.propTypes = {
    classes: shape({
        item: string,
        root: string
    }),
    limit: number.isRequired,
    onNavigate: func,
    products: arrayOf(
        shape({
            id: oneOfType([number, string]).isRequired
        })
    ).isRequired
};
