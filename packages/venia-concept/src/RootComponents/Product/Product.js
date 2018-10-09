import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import { bool, shape, number, arrayOf, string } from 'prop-types';

import { addItemToCart, addConfigurableItemToCart } from 'src/actions/cart';
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

    state = {
        isDataInitialized: false
    }

    getCurrentConfiguration(item) {
        let currentItem = item.variants;
        const options = Object.keys(this.state.selectedOptions);
        options.forEach((option) => {
            currentItem = currentItem.filter((variant) => {
                const value_index = this.state.selectedOptions[option].value_index;
                const product_index = parseInt(variant.product[option]);
                let isValuePresent = !!(product_index === value_index);
                return isValuePresent;
            });
        });
        return currentItem[0].product;
    }

    addConfigurableToCart = async (item, quantity) => {
        const options = item.configurable_options.map((option) => {
            return {
                option_value: this.state.selectedOptions[option.attribute_code].value_index,
                option_id: option.attribute_id
            };
        });
        // TODO: Reevaluate getCurrentConfiguration
        // The rest api retrieves the correct SKU for the item based on the
        // product options. (Exactly what getCurrentConfiguration does)
        const currentItem = this.getCurrentConfiguration(item);
        const parentSKU = item.sku;
        currentItem.options = options;
        await this.props.addConfigurableItemToCart({ parentSKU, currentItem, quantity});
    };

    addToCart = async (item, quantity) => {
        await this.props.addItemToCart({ item, quantity});
    };

    updateConfigurableItemToCart = async (options) => {
        await this.setState({
            ...this.state,
            selectedOptions: {
                ...this.state.selectedOptions,
                ...options
            }
        });
        console.log(this.state);
    };

    // TODO: Make it obey actual default values, not just the first one
    initOptions = (data) => {
        const product = data.productDetail;
        const isConfigurable = product && product.items[0].__typename === 'ConfigurableProduct';
        if (isConfigurable && !this.state.isDataInitialized) {
            const options = product.items[0].configurable_options
            const initialState = {};
            options.forEach((option) => {
                initialState[option.attribute_code] = {
                    value: option.values[0].label,
                    value_index: option.values[0].value_index,
                    position: option.position,

                }
            })
            this.state = {
                isDataInitialized:  true,
                selectedOptions: {
                    ...initialState,
                }
            };
        }
    }

    render() {
        const { addToCart, addConfigurableToCart } = this;
        const query = getProductDetail;
        return (
            <Page>
                <Query
                    onCompleted={this.initOptions}
                    query={getProductDetail}
                    variables={{ urlKey: getUrlKey(), onServer: false }}
                >
                    {({ loading, error, data }) => {
                        if (error) return <div>Data Fetch Error</div>;
                        if (loading) return <div>Fetching Data</div>;
                        let onAddToCart = addToCart;

                        const product = data.productDetail.items[0];
                        if ( product.__typename === 'ConfigurableProduct' ) {
                            onAddToCart = addConfigurableToCart;
                        }

                        return (
                            <ProductFullDetail
                                product={product}
                                updateConfigurableItemToCart={this.updateConfigurableItemToCart}
                                addToCart={onAddToCart}
                            />
                        );
                    }}
                </Query>
            </Page>
        );
    }
}

const mapDispatchToProps = {
    addItemToCart,
    addConfigurableItemToCart
};

export default connect(
    null,
    mapDispatchToProps
)(Product);
