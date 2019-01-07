import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { bool, shape, number, arrayOf, string } from 'prop-types';

import { addItemToCart } from 'src/actions/cart';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import ProductFullDetail from 'src/components/ProductFullDetail';
import getUrlKey from 'src/util/getUrlKey';

const query = gql`
    query productDetail($urlKey: String, $onServer: Boolean!) {
        productDetail: products(filter: { url_key: { eq: $urlKey } }) {
            items {
                sku
                name
                price {
                    regularPrice {
                        amount {
                            currency
                            value
                        }
                    }
                }
                description
                media_gallery_entries {
                    label
                    position
                    disabled
                    file
                }
                ... on ConfigurableProduct {
                    configurable_options {
                        attribute_code
                        attribute_id
                        id
                        label
                        values {
                            default_label
                            label
                            store_label
                            use_default_value
                            value_index
                        }
                    }
                    variants {
                        product {
                            fashion_color
                            fashion_size
                            id
                            media_gallery_entries {
                                disabled
                                file
                                label
                                position
                            }
                            sku
                            stock_status
                        }
                    }
                }
                meta_title @include(if: $onServer)
                meta_keyword @include(if: $onServer)
                meta_description @include(if: $onServer)
            }
        }
    }
`;

/**
 * As of this writing, there is no single Product query type in the M2.3 schema.
 * The recommended solution is to use filter criteria on a Products query.
 * However, the `id` argument is not supported. See
 * https://github.com/magento/graphql-ce/issues/86
 * TODO: Replace with a single product query when possible.
 */
class Product extends Component {
    static propTypes = {
        data: shape({
            productDetail: shape({
                total_count: number,
                items: arrayOf(
                    shape({
                        id: number,
                        sku: string.isRequired,
                        price: shape({
                            regularPrice: shape({
                                amount: shape({
                                    currency: string.isRequired,
                                    value: number.isRequired
                                })
                            }).isRequired
                        }).isRequired,
                        image: string,
                        image_label: string,
                        media_gallery_entries: arrayOf(
                            shape({
                                label: string,
                                position: number.isRequired,
                                disabled: bool,
                                file: string.isRequired
                            })
                        ),
                        description: string,
                        short_description: string,
                        canonical_url: string
                    })
                ).isRequired
            }).isRequired
        })
    };

    addToCart = async (item, quantity) => {
        const { guestCartId } = this.props;
        await this.props.addItemToCart({ guestCartId, item, quantity });
    };

    render() {
        return (
            <Query
                query={query}
                variables={{ urlKey: getUrlKey(), onServer: false }}
            >
                {({ loading, error, data }) => {
                    if (error) return <div>Data Fetch Error</div>;
                    if (loading) return loadingIndicator;

                    const product = data.productDetail.items[0];

                    return (
                        <ProductFullDetail
                            product={product}
                            addToCart={this.props.addItemToCart}
                        />
                    );
                }}
            </Query>
        );
    }
}

const mapDispatchToProps = {
    addItemToCart
};

export default connect(
    null,
    mapDispatchToProps
)(Product);
