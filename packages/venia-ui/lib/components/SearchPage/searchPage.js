import React from 'react';
import { shape, string } from 'prop-types';

import { useSearchPage } from '@magento/peregrine/lib/talons/SearchPage/useSearchPage';

import { mergeClasses } from '../../classify';
import Gallery from '../Gallery';
import FilterModal from '../FilterModal';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import Pagination from '../../components/Pagination';
import defaultClasses from './searchPage.css';
import PRODUCT_SEARCH from '../../queries/productSearch.graphql';

const SearchPage = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useSearchPage({
        query: PRODUCT_SEARCH
    });

    const {
        loading,
        error,
        data,
        inputText,
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

    if (!data) {
        return null;
    }

    const { products } = data;
    const { aggregations: filters, total_count, items } = products;

    if (items.length === 0) {
        return <div className={classes.noResult}>No results found!</div>;
    }

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
                    {`"${inputText}" - ${total_count} items`}
                </div>
                {maybeFilterButtons}
            </div>
            {maybeFilterModal}
            <section className={classes.gallery}>
                <Gallery items={items} />
            </section>
            <section className={classes.pagination}>
                <Pagination pageControl={pageControl} />
            </section>
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
