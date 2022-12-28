import React, { useMemo } from 'react';
import useCompareProduct from '@magento/peregrine/lib/talons/ComparePage/useCompareProduct';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '../../classify';

import defaultClasses from './compareProducts.module.css';
import LoadingIndicator from '../LoadingIndicator';
import ProductsTable from './ProductsTable';
const CompareProducts = () => {
    const talonProps = useCompareProduct();
    const { productsItems, deleteProduct, isLoading, productsCount } = talonProps;
    const classes = useStyle(defaultClasses);

    const productsElements = useMemo(() => {
        if (isLoading) {
            return <LoadingIndicator />;
        } else {
            if (productsItems?.length == 0) {
                return;
            }
            return <ProductsTable deleteProduct={deleteProduct} productsItems={productsItems?.items} />;
        }
    }, [deleteProduct, isLoading, productsItems?.items, productsItems?.length]);
    return (
        <div className={classes.root} data-cy="CompareProducts-root">
            <h1 className={classes.heading} data-cy="CompareProductsPage-heading">
                <FormattedMessage id={'compareProducts.CompareProducts'} defaultMessage="Compare Products" />
            </h1>
            <div className={classes.productsWrapper} data-cy="compare-products-root">
                <div className={classes.header}>
                    <h2 className={classes.name} data-cy="compare-products-name">
                        <FormattedMessage id={'compareProducts.CompareProducts'} defaultMessage="Compare Products" />
                    </h2>
                    <div className={classes.name}>
                        {productsCount}&nbsp;
                        <FormattedMessage id={'compareProducts.itemsList'} defaultMessage="items in this list" />
                    </div>
                </div>
                <div> {productsElements} </div>
            </div>
        </div>
    );
};

export default CompareProducts;
