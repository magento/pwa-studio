import { Component, createElement } from 'react';
import { bool, shape, number, arrayOf, string } from 'prop-types';
import { Price } from '@magento/peregrine';

import getUrlKey from 'src/util/getUrlKey';
import Page from 'src/components/Page';
import ProductFullDetail from 'src/components/ProductFullDetail';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';

import { addItemToCart, toggleCart, getCartDetails } from 'src/actions/cart';

/**
 * As of this writing, there is no single Product query type in the M2.3 schema.
 * The recommended solution is to use filter criteria on a Products query.
 * However, the `id` argument is not supported. See
 * https://github.com/magento/graphql-ce/issues/86
 * TODO: Replace with a single product query when possible.
 */
const productDetailQuery = gql`
    query productDetail($urlKey: String) {
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
            }
        }
    }
`;

class Product extends Component {
    static propTypes = {
        classes: shape({
            action: string,
            actions: string,
            addToCart: string,
            cartActions: string,
            description: string,
            descriptionTitle: string,
            details: string,
            detailsTitle: string,
            imageCarousel: string,
            productName: string,
            productPrice: string,
            quantity: string,
            quantityTitle: string,
            root: string,
            title: string
        }),
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
            <Page>
                <Query
                    query={productDetailQuery}
                    variables={{ urlKey: getUrlKey() }}
                >
                    {({ loading, error, data }) => {
                        if (error) return <div>Data Fetch Error</div>;
                        if (loading) return <div>Fetching Data</div>;

                        const product = data.productDetail.items[0];

                        return (
                            <ProductFullDetail
                                product={product}
                                onClickAddToCart={this.addToCart}
                            />
                        );
                    }}
                </Query>
            </Page>
        );
    }
}

export default connect(
    ({ cart: { guestCartId } = {} }) => ({ guestCartId }),
    {
        addItemToCart,
        getCartDetails,
        toggleCart
    }
)(Product);
