import React from 'react';
import { string, shape } from 'prop-types';
import { mergeClasses } from 'src/classify';
import { Link, resourceUrl } from 'src/drivers';
import defaultClasses from './noProductsFound.css';

const NoProductsFound = props => {
    const { categoryName } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <h1 className={classes.title}>{categoryName}</h1>
            <p>There are no products found in this category</p>
            <Link to={resourceUrl('/')} className={classes.continueShopping}>
                Continue Shopping
            </Link>
        </div>
    );
};

export default NoProductsFound;

NoProductsFound.propTypes = {
    classes: shape({
        root: string,
        title: string,
        continueShopping: string
    }),
    categoryName: string.isRequired
};
