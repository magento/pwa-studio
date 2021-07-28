import React, { Fragment, Suspense, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { shape, string } from 'prop-types';

import { useSearchPage } from '@magento/peregrine/lib/talons/SearchPage/useSearchPage';

import { useStyle } from '../../classify';
import Pagination from '../../components/Pagination';
import Gallery from '../Gallery';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import ProductSort from '../ProductSort';
import defaultClasses from './searchPage.css';
import SortedByContainer from '../SortedByContainer';
import FilterModalOpenButton from '../FilterModalOpenButton';

const FilterModal = React.lazy(() => import('../FilterModal'));
const FilterSidebar = React.lazy(() => import('../FilterSidebar'));

const SearchPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useSearchPage();
    const {
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
    const content = useMemo(() => {
        if (!data && loading) return fullPageLoadingIndicator;

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

    // If there are no products we can hide the sort button.
    const shouldShowSortButtons = productsCount;

    const maybeFilterButtons = shouldShowFilterButtons ? (
        <FilterModalOpenButton filters={filters} />
    ) : null;

    const maybeFilterModal = shouldShowFilterButtons ? (
        <FilterModal filters={filters} />
    ) : null;

    const maybeSidebar = shouldShowFilterButtons ? (
        <FilterSidebar filters={filters} />
    ) : null;

    const maybeSortButton = shouldShowSortButtons ? (
        <ProductSort sortProps={sortProps} />
    ) : null;

    const maybeSortContainer = shouldShowSortButtons ? (
        <SortedByContainer currentSort={currentSort} />
    ) : null;

    const searchResultsHeading = !data ? null : searchTerm ? (
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

    const itemCountHeading =
        data && !loading ? (
            <span className={classes.totalPages}>
                {formatMessage(
                    {
                        id: 'searchPage.totalPages',
                        defaultMessage: `items`
                    },
                    { totalCount: productsCount }
                )}
            </span>
        ) : null;

    return (
        <article className={classes.root}>
            <div className={classes.sidebar}>
                <Suspense fallback={null}>{maybeSidebar}</Suspense>
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
