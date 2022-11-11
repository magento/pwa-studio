import React, { Fragment, Suspense, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { shape, string } from 'prop-types';
import { useSearchPage } from '@magento/peregrine/lib/talons/SearchPage/useSearchPage';

import { useStyle } from '../../classify';
import Pagination from '../../components/Pagination';
import Gallery, { GalleryShimmer } from '../Gallery';
import ProductSort, { ProductSortShimmer } from '../ProductSort';
import defaultClasses from './searchPage.module.css';
import SortedByContainer, {
    SortedByContainerShimmer
} from '../SortedByContainer';
import FilterModalOpenButton, {
    FilterModalOpenButtonShimmer
} from '../FilterModalOpenButton';
import { FilterSidebarShimmer } from '../FilterSidebar';
import Shimmer from '../Shimmer';
import { Meta, Title } from '../Head';

const FilterModal = React.lazy(() => import('../FilterModal'));
const FilterSidebar = React.lazy(() => import('../FilterSidebar'));

const SearchPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useSearchPage();
    const {
        availableSortMethods,
        data,
        error,
        filters,
        loading,
        pageControl,
        searchCategory,
        searchTerm,
        sortProps,
        currentStoreName
    } = talonProps;

    const { formatMessage } = useIntl();

    const [currentSort] = sortProps;
    const metaTitle = `${currentStoreName}'s Search Result for term ${searchTerm}`;
    const content = useMemo(() => {
        if (!data && loading) {
            return (
                <Fragment>
                    <section className={classes.gallery}>
                        <GalleryShimmer
                            items={Array.from({ length: 12 }).fill(null)}
                        />
                    </section>
                    <section className={classes.pagination} />
                </Fragment>
            );
        }

        if (!data && error) {
            return (
                <div aria-live="polite" className={classes.noResult}>
                    <FormattedMessage
                        id={'searchPage.noResult'}
                        defaultMessage={
                            'No results found. The search term may be missing or invalid.'
                        }
                    />
                </div>
            );
        }

        if (!data) {
            return null;
        }

        if (data.products.items.length === 0) {
            return (
                <div
                    aria-live="polite"
                    className={classes.noResult}
                    data-cy="SearchPage-noResult"
                >
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
                        <Gallery items={data.products.items} />
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
        data,
        pageControl
    ]);

    const productsCount =
        data && data.products && data.products.total_count
            ? data.products.total_count
            : 0;

    const shouldShowFilterButtons = filters && filters.length;
    const shouldShowFilterShimmer = filters === null;

    // If there are no products we can hide the sort button.
    const shouldShowSortButtons = productsCount && availableSortMethods;
    const shouldShowSortShimmer = !productsCount && loading;

    const maybeFilterButtons = shouldShowFilterButtons ? (
        <FilterModalOpenButton filters={filters} />
    ) : shouldShowFilterShimmer ? (
        <FilterModalOpenButtonShimmer />
    ) : null;

    const maybeFilterModal = shouldShowFilterButtons ? (
        <FilterModal filters={filters} />
    ) : null;

    const maybeSidebar = shouldShowFilterButtons ? (
        <FilterSidebar filters={filters} />
    ) : shouldShowFilterShimmer ? (
        <FilterSidebarShimmer />
    ) : null;

    const maybeSortButton = shouldShowSortButtons ? (
        availableSortMethods && (
            <ProductSort
                sortProps={sortProps}
                availableSortMethods={availableSortMethods}
            />
        )
    ) : shouldShowSortShimmer ? (
        <ProductSortShimmer />
    ) : null;

    const maybeSortContainer = shouldShowSortButtons ? (
        <SortedByContainer currentSort={currentSort} />
    ) : shouldShowSortShimmer ? (
        <SortedByContainerShimmer />
    ) : null;

    const searchResultsHeading = loading ? (
        <Shimmer width={5} />
    ) : !data ? null : searchTerm ? (
        <FormattedMessage
            id={'searchPage.searchTerm'}
            values={{
                highlight: chunks => (
                    <span className={classes.headingHighlight}>{chunks}</span>
                ),
                category: searchCategory,
                term: searchTerm
            }}
            defaultMessage="Showing results for <highlight>{term}</highlight>{category, select, null {} other { in <highlight>{category}</highlight>}}:"
        />
    ) : (
        <FormattedMessage
            id={'searchPage.searchTermEmpty'}
            defaultMessage={'Showing all results:'}
        />
    );

    const itemCountHeading =
        data && !loading ? (
            <span aria-live="polite" className={classes.totalPages}>
                {formatMessage(
                    {
                        id: 'searchPage.totalPages',
                        defaultMessage: '{totalCount} items'
                    },
                    { totalCount: productsCount }
                )}
            </span>
        ) : loading ? (
            <Shimmer width={5} />
        ) : null;

    const metaLabel = [searchTerm, `${STORE_NAME} Search`]
        .filter(Boolean)
        .join(' - ');

    return (
        <article className={classes.root} data-cy="SearchPage-root">
            <div className={classes.sidebar}>
                <Suspense fallback={<FilterSidebarShimmer />}>
                    {maybeSidebar}
                </Suspense>
            </div>
            <div className={classes.searchContent}>
                <div className={classes.heading}>
                    <div
                        aria-live="polite"
                        aria-atomic="true"
                        className={classes.searchInfo}
                    >
                        {searchResultsHeading}
                        {itemCountHeading}
                    </div>
                    <div className={classes.headerButtons}>
                        {maybeFilterButtons}
                        {maybeSortButton}
                    </div>
                    {maybeSortContainer}
                </div>
                {content}
                <Suspense fallback={null}>{maybeFilterModal}</Suspense>
            </div>
            <Title>{metaTitle}</Title>
            <Meta name="title" content={metaTitle} />
            <Meta name="description" content={metaLabel} />
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
