import React, { Fragment, Component } from 'react';
import { string, func } from 'prop-types';

import { Query } from '@magento/venia-drivers';

import { Title } from '../../components/Head';
import ErrorView from '../../components/ErrorView';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';
import ProductFullDetail from '../../components/ProductFullDetail';
import getUrlKey from '../../util/getUrlKey';
import productQuery from '../../queries/getProductDetail.graphql';

/**
 * As of this writing, there is no single Product query type in the M2.3 schema.
 * The recommended solution is to use filter criteria on a Products query.
 * However, the `id` argument is not supported. See
 * https://github.com/magento/graphql-ce/issues/86
 * TODO: Replace with a single product query when possible.
 */
class Product extends Component {
    static propTypes = {
        cartId: string
    };

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    // map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
    mapProduct(product) {
        const { description } = product;
        return {
            ...product,
            description:
                typeof description === 'object' ? description.html : description
        };
    }

    render() {
        return (
            <Query
                query={productQuery}
                variables={{ urlKey: getUrlKey(), onServer: false }}
            >
                {({ loading, error, data }) => {
                    if (error) return <div>Data Fetch Error</div>;
                    if (loading) return fullPageLoadingIndicator;

                    const product = data.productDetail.items[0];

                    if (!product) {
                        return <ErrorView outOfStock={true} />;
                    }

                    return (
                        <Fragment>
                            <Title>{`${product.name} - ${STORE_NAME}`}</Title>
                            <ProductFullDetail
                                product={this.mapProduct(product)}
                            />
                        </Fragment>
                    );
                }}
            </Query>
        );
    }
}

export default Product;
