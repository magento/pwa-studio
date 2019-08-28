import React from 'react';
import { Query } from '@magento/venia-drivers';
import gql from 'graphql-tag';
import GalleryItems from '../../../../Gallery/items';
import defaultClasses from './products.css';
import { mergeClasses } from '../../../../../classify';
import { arrayOf, shape, string } from 'prop-types';

const Products = ({
    classes,
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
    cssClasses
}) => {
    classes = mergeClasses(defaultClasses, classes);

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

    const productsQuery = gql`
        query getProductsBySku($skus: [String]) {
            products(filter: { sku: { in: $skus } }) {
                items {
                    id
                    name
                    sku
                    small_image {
                        url
                    }
                    url_key
                    price {
                        regularPrice {
                            amount {
                                value
                                currency
                            }
                        }
                    }
                }
                total_count
                filters {
                    name
                    filter_items_count
                    request_var
                    filter_items {
                        label
                        value_string
                    }
                }
            }
        }
    `;

    return (
        <div style={dynamicStyles} className={cssClasses.join(' ')}>
            <Query query={productsQuery} variables={{ skus }}>
                {({ loading, error, data }) => {
                    if (error) return 'Data fetch error...';
                    if (loading) return 'Loading products...';

                    if (data.products.items.length === 0) {
                        return <div>No products to display</div>;
                    }

                    // We have to manually resort the products
                    const products = [];
                    skus.forEach(sku => {
                        const product = data.products.items.find(
                            product => product.sku === sku
                        );
                        if (product) {
                            products.push(product);
                        }
                    });

                    return (
                        <div className={classes.gallery}>
                            <div className={classes.items}>
                                <GalleryItems items={products} />
                            </div>
                        </div>
                    );
                }}
            </Query>
        </div>
    );
};

Products.propTypes = {
    classes: shape({
        gallery: string,
        items: string
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
    cssClasses: arrayOf(string)
};

export default Products;
