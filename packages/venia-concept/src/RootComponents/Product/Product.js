import React, { Component } from 'react';
import { string, func } from 'prop-types';

import { isUndefined } from 'util';

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
        cartId: string
    };

    addToCart = async (item, quantity) => {
        const { addItemToCart, cartId } = this.props;
        await addItemToCart({ cartId, item, quantity });
    };

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    // map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
    mapProduct(product) {
        if (!isUndefined(product)) {
            const { description } = product;
            return {
                ...product,
                description:
                    typeof description === 'object'
                        ? description.html
                        : description
            };
        }
        return false;
    }

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
                    const productData = this.mapProduct(product);
                    if (productData) {
                        return (
                            <ProductFullDetail
                                product={this.mapProduct(product)}
                                addToCart={this.props.addItemToCart}
                            />
                        );
                    } else {
                        return <div>Product Out Of Stock</div>;
                    }
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
