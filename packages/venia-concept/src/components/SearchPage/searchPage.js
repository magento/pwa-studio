import React, { Fragment, Suspense, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { shape, string } from 'prop-types';

import { useSearchPage } from '@magento/peregrine/lib/talons/SearchPage/useSearchPage';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Pagination from '@magento/venia-ui/lib/components/Pagination';
import Gallery, {
    GalleryShimmer
} from '@magento/venia-ui/lib/components/Gallery';
import ProductSort, {
    ProductSortShimmer
} from '@magento/venia-ui/lib/components/ProductSort';
import defaultClasses from '@magento/venia-ui/lib/components/SearchPage/searchPage.module.css';
import SortedByContainer, {
    SortedByContainerShimmer
} from '@magento/venia-ui/lib/components/SortedByContainer';
import FilterModalOpenButton, {
    FilterModalOpenButtonShimmer
} from '@magento/venia-ui/lib/components/FilterModalOpenButton';
import { FilterSidebarShimmer } from '@magento/venia-ui/lib/components/FilterSidebar';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import { Meta, Title } from '@magento/venia-ui/lib/components/Head';

const FilterModal = React.lazy(() =>
    import('@magento/venia-ui/lib/components/FilterModal')
);
const FilterSidebar = React.lazy(() =>
    import('@magento/venia-ui/lib/components/FilterSidebar')
);

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
        sortProps
    } = talonProps;

    const { formatMessage } = useIntl();
    const [currentSort] = sortProps;
    const [filterState, setfilterState] = useState();

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

        if (!data) {
            return null;
        }

        if (data.products.items.length === 0) {
            return (
                <div className={classes.noResult} data-cy="SearchPage-noResult">
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
                        <Gallery
                            items={data.products.items}
                            filterState={filterState}
                        />
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
        <FilterSidebar setfilterState={setfilterState} filters={filters} />
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
            <span className={classes.totalPages}>
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
                    <div className={classes.searchInfo}>
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
            <Title>{metaLabel}</Title>
            <Meta name="title" content={metaLabel} />
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
