/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { string } from 'prop-types';
import { Link, useHistory } from 'react-router-dom';

import { useBreadcrumbs } from '@magento/peregrine/lib/talons/Breadcrumbs/useBreadcrumbs';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '../../classify';
import Shimmer from './breadcrumbs.shimmer';
import defaultClasses from './breadcrumbs.module.css';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'react-feather';

const DELIMITER = '/';
/**
 * Breadcrumbs! Generates a sorted display of category links.
 *
 * @param {String} props.categoryId the uid of the category for which to generate breadcrumbs
 * @param {String} props.currentProduct the name of the product we're currently on, if any.
 */
const Breadcrumbs = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const { categoryId, currentProduct, url_keys, productSku } = props;

    const history = useHistory();
    
    const urlKeysHistory = history.location?.state?.urlKeys;
    const currentUrlKeys = urlKeysHistory ? urlKeysHistory : url_keys;
    const talonProps = useBreadcrumbs({ categoryId });

    const { currentCategory, currentCategoryPath, hasError, isLoading, normalizedData, handleClick } = talonProps;

    const productLink = product => resourceUrl(`/${product.url_key}${product.url_suffix || ''}`);

    const moveToOtherProcuct = type => {
        const configrableProducts = currentUrlKeys?.items.filter(
            ({ __typename }) => __typename === 'ConfigurableProduct'
        );
        const configrableIndex = configrableProducts.findIndex(ele => ele.sku === productSku);
        if (type === 'next' && configrableIndex === configrableProducts?.length - 1) {
            const product = configrableProducts[0];
            history.push({
                pathname: productLink(product),
                state: { urlKeys: currentUrlKeys }
            });
        } else if (type === 'prev' && configrableIndex === 0) {
            const product = configrableProducts[configrableProducts?.length - 1];
            history.push({
                pathname: productLink(product),
                state: { urlKeys: currentUrlKeys }
            });
        } else if (configrableIndex < configrableProducts?.length) {
            if (type === 'prev') {
                const prevProduct = configrableProducts[configrableIndex - 1];
                history.push({
                    pathname: productLink(prevProduct),
                    state: { urlKeys: currentUrlKeys }
                });
            } else if (type === 'next') {
                const nextProduct = configrableProducts[configrableIndex + 1];
                history.push({
                    pathname: productLink(nextProduct),
                    state: { urlKeys: currentUrlKeys }
                });
            }
        }
    };

    // For all links generate a fragment like "/ Text"
    const links = useMemo(() => {
        return normalizedData.map(({ text, path }) => {
            return (
                <Fragment key={text}>
                    <span className={classes.divider}>{DELIMITER}</span>
                    <Link className={classes.link} to={resourceUrl(path)} onClick={handleClick}>
                        {text}
                    </Link>
                </Fragment>
            );
        });
    }, [classes.divider, classes.link, handleClick, normalizedData]);

    if (isLoading) {
        return <Shimmer />;
    }

    // Don't display anything but the empty, static height div when there's an error.
    if (hasError) {
        return <div className={classes.root} aria-live="polite" aria-busy="false" />;
    }

    // If we have a "currentProduct" it means we're on a PDP so we want the last
    // category text to be a link. If we don't have a "currentProduct" we're on
    // a category page so it should be regular text.
    const currentCategoryLink = currentProduct ? (
        <Link className={classes.link} to={resourceUrl(currentCategoryPath)} onClick={handleClick}>
            {currentCategory}
        </Link>
    ) : (
        <span className={classes.currentCategory}>{currentCategory}</span>
    );

    const currentProductNode = currentProduct ? (
        <Fragment>
            <span className={classes.divider}>{DELIMITER}</span>
            <span className={classes.text}>{currentProduct}</span>
        </Fragment>
    ) : null;

    return (
        <div className={classes.root} aria-live="polite" aria-busy="false">
            <div className={classes.leftNav} aria-live="polite" aria-busy="false">
                <Link className={classes.link} to="/">
                    <FormattedMessage id={'global.home'} defaultMessage={'Home'} />
                </Link>
                {links}
                <span className={classes.divider}>{DELIMITER}</span>
                {currentCategoryLink}
                {currentProductNode}
            </div>

            {(urlKeysHistory || currentUrlKeys) && (
                <div className={classes.rightNav}>
                    <button onClick={() => moveToOtherProcuct('prev')}>
                        <Icon src={ChevronLeftIcon} />
                    </button>
                    <button onClick={() => moveToOtherProcuct('next')}>
                        <Icon src={ChevronRightIcon} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Breadcrumbs;

Breadcrumbs.propTypes = {
    categoryId: string.isRequired,
    currentProduct: string
};
