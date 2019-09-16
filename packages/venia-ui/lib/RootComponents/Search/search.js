import React, { useCallback, useEffect, useRef } from 'react';
import { Query, Redirect } from '@magento/venia-drivers';
import { bool, func, object, shape, string } from 'prop-types';
import { getFilterParams } from '@magento/peregrine/lib/util/getFilterParamsFromUrl';

import { mergeClasses } from '../../classify';
import Gallery from '../../components/Gallery';
import FilterModal from '../../components/FilterModal';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';
import PRODUCT_SEARCH from '../../queries/productSearch.graphql';
import getQueryParameterValue from '../../util/getQueryParameterValue';
import isObjectEmpty from '../../util/isObjectEmpty';
import CategoryFilters from './categoryFilters';
import defaultClasses from './search.css';

const Search = props => {
    const {
        executeSearch,
        filterClear,
        history,
        location,
        openDrawer,
        searchOpen,
        toggleSearch
    } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const shouldClear = useRef(false);

    const inputText = getQueryParameterValue({
        location,
        queryParameter: 'query'
    });
    const categoryId = getQueryParameterValue({
        location,
        queryParameter: 'category'
    });
    const queryVariable = categoryId
        ? { inputText, categoryId }
        : { inputText };

    // memoize the render prop for Query
    // TODO: replace with `useQuery` hook
    const renderResult = useCallback(
        resultProps => {
            const { data, error, loading } = resultProps;

            if (error) return <div>Data Fetch Error</div>;
            if (loading) return fullPageLoadingIndicator;

            const { products } = data;
            const { filters, total_count, items } = products;

            if (items.length === 0) {
                return (
                    <div className={classes.noResult}>No results found!</div>
                );
            }

            const maybeCategoryFilters = categoryId ? (
                <CategoryFilters
                    categoryId={categoryId}
                    executeSearch={executeSearch}
                    history={history}
                    location={location}
                />
            ) : null;

            const maybeFilterButtons = filters ? (
                <div className={classes.headerButtons}>
                    <button
                        onClick={openDrawer}
                        className={classes.filterButton}
                    >
                        Filter
                    </button>
                </div>
            ) : null;

            const maybeFilterModal = filters ? (
                <FilterModal filters={filters} />
            ) : null;

            return (
                <article className={classes.root}>
                    <div className={classes.categoryTop}>
                        <div className={classes.totalPages}>
                            {`${total_count} items`}
                        </div>
                        {maybeCategoryFilters}
                        {maybeFilterButtons}
                    </div>
                    {maybeFilterModal}
                    <section className={classes.gallery}>
                        <Gallery data={items} />
                    </section>
                </article>
            );
        },
        [categoryId, classes, executeSearch, history, location, openDrawer]
    );

    // derive initial state from query params
    // never re-run this effect, even if deps change
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        // clear filters if there are no filter params
        if (isObjectEmpty(getFilterParams())) {
            filterClear();
        }

        // ensure search is open to begin with
        if (toggleSearch && !searchOpen && inputText) {
            toggleSearch();
        }
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */

    // clear filters whenever the `query` search param changes
    // but don't clear them on mount
    useEffect(() => {
        if (shouldClear.current) {
            filterClear();
        } else {
            shouldClear.current = true;
        }
    }, [filterClear, inputText]);

    // redirect to the home page if the query doesn't contain input
    if (!inputText) {
        return <Redirect to="/" />;
    }

    return (
        <Query query={PRODUCT_SEARCH} variables={queryVariable}>
            {renderResult}
        </Query>
    );
};

export default Search;

Search.propTypes = {
    classes: shape({
        noResult: string,
        root: string,
        totalPages: string
    }),
    executeSearch: func.isRequired,
    history: object,
    location: object.isRequired,
    openDrawer: func.isRequired,
    searchOpen: bool,
    toggleSearch: func
};
