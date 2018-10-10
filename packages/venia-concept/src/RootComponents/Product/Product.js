import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { bool, shape, number, arrayOf, string } from 'prop-types';

import Page from 'src/components/Page';
import ProductFullDetail from 'src/components/ProductFullDetail';
import getUrlKey from 'src/util/getUrlKey';
import getProductDetail from '../../queries/getProductDetail.graphql';

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
        await this.props.addItemToCart({ item, quantity});
    };

    render() {
        const { addItemToCart, addConfigurableItemToCart } = this.props;
        return (
            <Page>
                <Query
                    query={getProductDetail}
                    variables={{ urlKey: getUrlKey(), onServer: false }}
                >
                    {({ loading, error, data }) => {
                        if (error) return <div>Data Fetch Error</div>;
                        if (loading) return <div>Fetching Data</div>;
                        let product = data.productDetail.items[0];

                        return (
                            <ProductFullDetail
                                product={product}
                                addItemToCart={addItemToCart}
                                addConfigurableItemToCart={addConfigurableItemToCart}
                            />
                        );
                    }}
                </Query>
            </Page>
        );
    }
}

export default Product;
