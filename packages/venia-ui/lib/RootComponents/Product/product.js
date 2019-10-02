import React, { Fragment, useEffect, useMemo } from 'react';
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

    const { loading, error, data } = useQuery(GET_PRODUCT_DETAIL, {
        variables: {
            onServer: false,
            urlKey: getUrlKey()
        }
    });

    // Memoize the result from the query to avoid unnecessary rerenders.
    const product = useMemo(() => {
        if (!data) {
            return;
        }
        const product = data.productDetail.items[0];
        // map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to
        // maintain backwards compatibility
        const { description } = product;
        return {
            ...product,
            description:
                typeof description === 'object' ? description.html : description
        };
    }, [data]);

    if (loading) return fullPageLoadingIndicator;
    if (error) return <div>Data Fetch Error</div>;

    if (!product) {
        return <ErrorView outOfStock={true} />;
    }

    // Note: STORE_NAME is injected by Webpack at build time.
    return (
        <Fragment>
            <Title>{`${product.name} - ${STORE_NAME}`}</Title>
            <ProductFullDetail product={product} />
        </Fragment>
    );
};

export default Product;
