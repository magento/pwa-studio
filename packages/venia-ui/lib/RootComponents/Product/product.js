import React, { Fragment, useCallback, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Title } from '../../components/Head';
import ErrorView from '../../components/ErrorView';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';
import ProductFullDetail from '../../components/ProductFullDetail';
import getUrlKey from '../../util/getUrlKey';

/*
 * As of this writing, there is no single Product query type in the M2.3 schema.
 * The recommended solution is to use filter criteria on a Products query.
 * However, the `id` argument is not supported. See
 * https://github.com/magento/graphql-ce/issues/86
 * TODO: Replace with a single product query when possible.
 */
import GET_PRODUCT_DETAIL from '../../queries/getProductDetail.graphql';

const Product = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
    const mapProduct = useCallback(product => {
        const { description } = product;
        return {
            ...product,
            description:
                typeof description === 'object' ? description.html : description
        };
    }, []);

    const { loading, error, data } = useQuery(GET_PRODUCT_DETAIL, {
        variables: {
            onServer: false,
            urlKey: getUrlKey()
        }
    });

    if (error) return <div>Data Fetch Error</div>;
    if (loading) return fullPageLoadingIndicator;

    const product = data.productDetail.items[0];

    if (!product) {
        return <ErrorView outOfStock={true} />;
    }

    return (
        <Fragment>
            {/* Note: STORE_NAME is injected by Webpack at build time. */}
            <Title>{`${product.name} - ${STORE_NAME}`}</Title>
            <ProductFullDetail product={mapProduct(product)} />
        </Fragment>
    );
};

export default Product;
