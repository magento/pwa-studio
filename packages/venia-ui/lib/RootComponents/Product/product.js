import React, { Fragment, useCallback, useEffect } from 'react';
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
    const [{ data, loading, error }, { runQuery, setLoading }] = useQuery(
        productQuery
    );

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await runQuery({
                variables: {
                    urlKey: getUrlKey(),
                    onServer: false
                }
            });
            setLoading(false);
        };
        fetchData();
    }, []); // eslint-disable-line

    // map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
    const mapProduct = useCallback(product => {
        const { description } = product;
        return {
            ...product,
            description:
                typeof description === 'object' ? description.html : description
        };
    }, []);

    if (error) {
        return <div>Data Fetch Error</div>;
    } else if (loading || !data) {
        return fullPageLoadingIndicator;
    } else {
        const product = data.productDetail.items[0];

        if (!product) {
            return <ErrorView outOfStock={true} />;
        }
        return (
            <Fragment>
                <Title>{`${product.name} - ${STORE_NAME}`}</Title>
                <ProductFullDetail product={mapProduct(product)} />
            </Fragment>
        );
    }
};

export default Product;
