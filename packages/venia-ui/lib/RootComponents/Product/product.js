import React, { Fragment, useEffect, useMemo } from 'react';
import { useQuery } from '@magento/peregrine';
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
const Product = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [queryResult, queryApi] = useQuery(productQuery);
    const { data, error, loading } = queryResult;
    const { runQuery, setLoading } = queryApi;

    // map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
    const product = useMemo(() => {
        if (!data) {
            return;
        }
        const product = data.productDetail.items[0];
        const { description } = product;
        return {
            ...product,
            description:
                typeof description === 'object' ? description.html : description
        };
    }, [data]);

    useEffect(() => {
        setLoading(true);

        runQuery({
            variables: { urlKey: getUrlKey(), onServer: false }
        });
    }, [runQuery, setLoading]);

    if (error) return <div>Data Fetch Error</div>;
    if (loading || !data) return fullPageLoadingIndicator;

    if (!product) {
        return <ErrorView outOfStock={true} />;
    }

    return (
        <Fragment>
            <Title>{`${product.name} - ${STORE_NAME}`}</Title>
            <ProductFullDetail product={product} />
        </Fragment>
    );
};

export default Product;
