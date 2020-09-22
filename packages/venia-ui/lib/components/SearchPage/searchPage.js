import React, { Fragment, Suspense } from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useSearchPage } from '@magento/peregrine/lib/talons/SearchPage/useSearchPage';

import { mergeClasses } from '../../classify';
import Gallery from '../Gallery';
import FilterModal from '../FilterModal';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import Pagination from '../../components/Pagination';
import defaultClasses from './searchPage.css';
import PRODUCT_SEARCH from '../../queries/productSearch.graphql';
import FILTER_INTROSPECTION from '../../queries/introspection/filterIntrospectionQuery.graphql';
import GET_PRODUCT_FILTERS_BY_SEARCH from '../../queries/getProductFiltersBySearch.graphql';
import ProductSort from '../ProductSort';
import Button from '../Button';

const SearchPage = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useSearchPage({
        queries: {
            filterIntrospection: FILTER_INTROSPECTION,
            getProductFiltersBySearch: GET_PRODUCT_FILTERS_BY_SEARCH,
            productSearch: PRODUCT_SEARCH
        }
    });

    const {
        data,
        error,
        filters,
        loading,
        openDrawer,
        pageControl,
        searchCategory,
        searchTerm,
        sortProps
    } = talonProps;

    const [currentSort] = sortProps;

    if (loading) return fullPageLoadingIndicator;
    if (error) {
        return (
            <div className={classes.noResult}>
                No results found. The search term may be missing or invalid.
            </div>
        );
    }

    let content;
    if (!data || data.products.items.length === 0) {
        content = <div className={classes.noResult}>No results found!</div>;
    } else {
        content = (
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

    const totalCount = data ? data.products.total_count : 0;

    const maybeFilterButtons =
        filters && filters.length ? (
            <Button
                priority={'low'}
                classes={{ root_lowPriority: classes.filterButton }}
                onMouseDown={openDrawer}
                type="button"
            >
                {'Filter'}
            </Button>
        ) : null;

    const maybeFilterModal =
        filters && filters.length ? <FilterModal filters={filters} /> : null;

    const maybeSortButton = totalCount ? (
        <ProductSort sortProps={sortProps} />
    ) : null;

    const maybeSortContainer = totalCount ? (
        <span className={classes.sortContainer}>
            {'Items sorted by '}
            <span className={classes.sortText}>{currentSort.sortText}</span>
        </span>
    ) : null;

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
        />
    ) : (
        <FormattedMessage id={'searchPage.searchTermEmpty'} />
    );

    return (
        <article className={classes.root}>
            <div className={classes.categoryTop}>
                <span className={classes.totalPages}>
                    {`${totalCount} items`}
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
