import React, { Component } from 'react';
import { bool, shape, number, arrayOf, string, func } from 'prop-types';

import { connect, Query } from 'src/drivers';
import { addItemToCart } from 'src/actions/cart';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import ProductFullDetail from 'src/components/ProductFullDetail';
import getUrlKey from 'src/util/getUrlKey';
import productQuery from 'src/queries/getProductDetail.graphql';

/**
 * As of this writing, there is no single Product query type in the M2.3 schema.
 * The recommended solution is to use filter criteria on a Products query.
 * However, the `id` argument is not supported. See
 * https://github.com/magento/graphql-ce/issues/86
 * TODO: Replace with a single product query when possible.
 */
class Product extends Component {
    static propTypes = {
        addItemToCart: func.isRequired,
        // TODO: where does cartId from from? Should it be added to mapStateToProps?
        cartId: string,
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
        const { cartId } = this.props;
        await this.props.addItemToCart({ cartId, item, quantity });
    };

    render() {
        return (
            <Query
                query={productQuery}
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
