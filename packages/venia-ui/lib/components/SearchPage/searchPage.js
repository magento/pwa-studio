import React, { Fragment, Suspense } from 'react';
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
import GET_PRODUCT_FILTERS_BY_CATEGORY from '../../queries/getProductFiltersByCategory.graphql';

const SearchPage = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useSearchPage({
        queries: {
            FILTER_INTROSPECTION,
            GET_PRODUCT_FILTERS_BY_CATEGORY,
            PRODUCT_SEARCH
        }
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

    const maybeFilterButtons = filters ? (
        <div className={classes.headerButtons}>
            <button onClick={openDrawer} className={classes.filterButton}>
                Filter
            </button>
        </div>
    ) : null;

    const maybeFilterModal = filters ? <FilterModal filters={filters} /> : null;

    return (
        <article className={classes.root}>
            <div className={classes.categoryTop}>
                <div className={classes.totalPages}>
                    {`${totalCount} items`}
                </div>
                {maybeFilterButtons}
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
