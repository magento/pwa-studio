import React from 'react';
import defaultClasses from './products.css';
import { mergeClasses } from '../../../../../classify';
import { arrayOf, shape, string } from 'prop-types';
import Gallery from '../../../../Gallery';
import GET_PRODUCTS_BY_SKU from '../../../../../queries/getProductsBySku.graphql';
import { useQuery } from '@apollo/react-hooks';

/**
 * Sort products based on the original order of SKUs
 *
 * @param {Array} skus
 * @param {Array} products
 * @returns {Array}
 */
const restoreSortOrder = (skus, products) => {
    const productsBySku = new Map();
    products.forEach(product => {
        productsBySku.set(product.sku, product);
    });
    return skus.map(sku => productsBySku.get(sku));
};

/**
 * Page Builder Products component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Products
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Products based on a number of skus.
 */
const Products = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const {
        skus,
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = []
    } = props;

    const dynamicStyles = {
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };

    const { loading, error, data } = useQuery(GET_PRODUCTS_BY_SKU, {
        variables: { skus }
    });

    if (loading) return null;

    if (error || data.products.items.length === 0) {
        return (
            <div
                style={dynamicStyles}
                className={[classes.root, ...cssClasses].join(' ')}
            >
                <div className={classes.error}>{'No products to display'}</div>
            </div>
        );
    }

    return (
        <div
            style={dynamicStyles}
            className={[classes.root, ...cssClasses].join(' ')}
        >
            <Gallery
                items={restoreSortOrder(skus, data.products.items)}
                classes={{ items: classes.galleryItems }}
            />
        </div>
    );
};

/**
 * Props for {@link Products}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Products
 * @property {String} classes.root CSS class for products
 * @property {String} classes.galleryItems CSS class to modify child gallery items
 * @property {String} classes.error CSS class for displaying fetch errors
 * @property {Array} skus List of SKUs to load into product list
 * @property {String} textAlign Alignment of content within the products list
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
Products.propTypes = {
    classes: shape({
        root: string,
        galleryItems: string,
        error: string
    }),
    skus: arrayOf(string),
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    paddingLeft: string,
    cssClasses: arrayOf(string)
};

export default Products;
