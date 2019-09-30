import React, { useCallback, useEffect, useRef } from 'react';
import { Query, Redirect } from '@magento/venia-drivers';
import { object, shape, string } from 'prop-types';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCatalogContext } from '@magento/peregrine/lib/context/catalog';
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
    const { history, location } = props;
    const shouldClear = useRef(false);
    const classes = mergeClasses(defaultClasses, props.classes);

    // retrieve app state and action creators
    const [appState, appApi] = useAppContext();
    const { searchOpen } = appState;
    const { executeSearch, toggleDrawer, toggleSearch } = appApi;
    const [, catalogApi] = useCatalogContext();
    const { clear: clearFilters } = catalogApi.actions.filterOption;

    // retrieve search params
    const queryValue = getQueryParameterValue({
        location,
        queryParameter: 'query'
    });
    const categoryId = getQueryParameterValue({
        location,
        queryParameter: 'category'
    });
    const queryVariable = categoryId
        ? { inputText: queryValue, categoryId }
        : { inputText: queryValue };

    const openDrawer = useCallback(() => {
        toggleDrawer('filter');
    }, [toggleDrawer]);

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
                        <Gallery items={items} />
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
            clearFilters();
        }

        // ensure search is open to begin with
        if (toggleSearch && !searchOpen && queryValue) {
            toggleSearch();
        }
    }, []);
    /* eslint-enable react-hooks/exhaustive-deps */

    // clear filters whenever the `query` search param changes
    // but don't clear them on mount
    useEffect(() => {
        if (shouldClear.current) {
            clearFilters();
        } else {
            shouldClear.current = true;
        }
    }, [clearFilters, queryValue]);

    // redirect to the home page if the query doesn't contain input
    if (!queryValue) {
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
    history: object,
    location: object.isRequired
};
