import React, { Fragment, Suspense, useState } from 'react';
import { shape, string } from 'prop-types';

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
import CategorySort from '../CategorySort';

const SearchPage = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const [sort, setSort] = useState({
        sortAttribute: 'relevance',
        sortDirection: 'ASC'
    });

    const { sortAttribute, sortDirection } = sort;

    const sortControl = {
        currentSort: sort,
        setSort: setSort
    };

    const talonProps = useSearchPage({
        queries: {
            filterIntrospection: FILTER_INTROSPECTION,
            getProductFiltersBySearch: GET_PRODUCT_FILTERS_BY_SEARCH,
            productSearch: PRODUCT_SEARCH
        },
        sort
    });

    const {
        data,
        error,
        filters,
        loading,
        openDrawer,
        pageControl
    } = talonProps;

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
            <button onClick={openDrawer} className={classes.filterButton}>
                Filter
            </button>
        ) : null;

    const getSortText = function(sortAttribute, sortDirection) {
        if (sortAttribute === 'relevance') {
            return 'Best Match';
        }

        if (sortAttribute === 'price') {
            if (sortDirection === 'ASC') {
                return 'Price: Low to High';
            }
            return 'Price: High to Low';
        }
    };

    const maybeFilterModal = filters ? <FilterModal filters={filters} /> : null;

    return (
        <article className={classes.root}>
            <div className={classes.categoryTop}>
                <div className={classes.totalPages}>
                    {`${totalCount} items`}
                </div>
                <div className={classes.headerButtons}>
                    {maybeFilterButtons}
                    <CategorySort sortControl={sortControl} />
                </div>
                <div className={classes.sortText}>
                    Items sorted by:{' '}
                    <b>{getSortText(sortAttribute, sortDirection)}</b>
                </div>
            </div>
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
