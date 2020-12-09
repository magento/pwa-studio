import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { useProduct } from '@magento/peregrine/lib/talons/RootComponents/Product/useProduct';

import { Title, Meta } from '../../components/Head';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';
import ProductFullDetail from '../../components/ProductFullDetail';
import getUrlKey from '../../util/getUrlKey';
import mapProduct from '../../util/mapProduct';

/*
 * As of this writing, there is no single Product query type in the M2.3 schema.
 * The recommended solution is to use filter criteria on a Products query.
 * However, the `id` argument is not supported. See
 * https://github.com/magento/graphql-ce/issues/86
 * TODO: Replace with a single product query when possible.
 */

const Product = () => {
    const talonProps = useProduct({
        mapProduct,
        urlKey: getUrlKey()
    });

    const { error, loading, product } = talonProps;

    if (loading && !product) return fullPageLoadingIndicator;
    if (error && !product)
        return (
            <div>
                <FormattedMessage
                    id={'product.errorFetch'}
                    defaultMessage={'Data Fetch Error'}
                />
            </div>
        );

    if (!product) {
        return (
            <h1>
                <FormattedMessage
                    id={'product.outOfStockTryAgain'}
                    defaultMessage={
                        'This Product is currently out of stock. Please try again later.'
                    }
                />
            </h1>
        );
    }

    // Note: STORE_NAME is injected by Webpack at build time.
    const title = `${product.name} - ${STORE_NAME}`;

    return (
        <Fragment>
            <Title>{title}</Title>
            <Meta name="description" content={product.meta_description} />
            <ProductFullDetail product={product} />
        </Fragment>
    );
};

export default Product;
