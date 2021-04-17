import React, { Fragment, Suspense, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { shape, string } from 'prop-types';

import { useSearchPage } from '@magento/peregrine/lib/talons/SearchPage/useSearchPage';

import { mergeClasses } from '../../classify';
import Pagination from '../../components/Pagination';
import Gallery from '../Gallery';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import ProductSort from '../ProductSort';
import defaultClasses from './searchPage.css';
import SortedByContainer from "../SortedByContainer";
import FilterModalOpenButton from "../FilterModalOpenButton";

const FilterModal = React.lazy(() => import('../FilterModal'));

const SearchPage = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const talonProps = useSearchPage();
    const {
        data = {
            products: {
                items: [],
                total_count: 0
            }
        },
        error,
        filters,
        loading,
        pageControl,
        searchCategory,
        searchTerm,
        sortProps
    } = talonProps;

    const {
        products: {
            items: productItems,
            total_count: productsCount
        }
    } = data;

    const { formatMessage } = useIntl();
    const [currentSort] = sortProps;
    const content = useMemo(() => {
        if (loading) return fullPageLoadingIndicator;

        if (error) {
            return (
                <div className={classes.noResult}>
                    <FormattedMessage
                        id={'searchPage.noResult'}
                        defaultMessage={
                            'No results found. The search term may be missing or invalid.'
                        }
                    />
                </div>
            );
        }

        if (productItems.length === 0) {
            return (
                <div className={classes.noResult}>
                    <FormattedMessage
                        id={'searchPage.noResultImportant'}
                        defaultMessage={'No results found!'}
                    />
                </div>
            );
        } else {
            return (
                <Fragment>
                    <section className={classes.gallery}>
                        <Gallery items={productItems} />
                    </section>
                    <section className={classes.pagination}>
                        <Pagination pageControl={pageControl} />
                    </section>
                </Fragment>
            );
        }
    }, [
        classes.gallery,
        classes.noResult,
        classes.pagination,
        error,
        loading,
        pageControl,
        productItems
    ]);

    const maybeFilterButtons =
        filters && filters.length ?
            <FilterModalOpenButton filters={filters} />
        : null;

    const maybeFilterModal =
        filters && filters.length ? <FilterModal filters={filters} /> : null;

    const maybeSortButton = productsCount ? (
        <ProductSort sortProps={sortProps} />
    ) : null;

    const maybeSortContainer = <SortedByContainer
        shouldDisplay={!!productsCount}
        currentSort={currentSort}
    />;

    const searchResultsHeading = searchTerm ? (
        <FormattedMessage
            id={'searchPage.searchTerm'}
            values={{
                highlight: chunks => (
                    <span className={classes.headingHighlight}>{chunks}</span>
                ),
                category: searchCategory,
                term: searchTerm
            }}
            defaultMessage={'Showing results:'}
        />
    ) : (
        <FormattedMessage
            id={'searchPage.searchTermEmpty'}
            defaultMessage={'Showing all results:'}
        />
    );

    return (
        <article className={classes.root}>
            <div className={classes.categoryTop}>
                <span className={classes.totalPages}>
                    {formatMessage(
                        {
                            id: 'searchPage.totalPages',
                            defaultMessage: `items`
                        },
                        { totalCount: productsCount }
                    )}
                </span>
                <div className={classes.headerButtons}>
                    {maybeFilterButtons}
                    {maybeSortButton}
                </div>
                {maybeSortContainer}
            </div>
            <div className={classes.heading}>{searchResultsHeading}</div>
            {content}
            <Suspense fallback={null}>{maybeFilterModal}</Suspense>
        </article>
    );
};

export default SearchPage;

SearchPage.propTypes = {
    classes: shape({
        noResult: string,
        root: string,
        totalPages: string
    })
};
