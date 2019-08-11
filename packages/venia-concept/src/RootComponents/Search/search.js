import React, { Component } from 'react';
import { Query, Redirect } from '@magento/venia-drivers';
import { bool, func, object, shape, string } from 'prop-types';
import gql from 'graphql-tag';

import Gallery from '../../components/Gallery';
import classify from '../../classify';
import Icon from '../../components/Icon';
import { getFilterParams } from '../../util/getFilterParamsFromUrl';
import getQueryParameterValue from '../../util/getQueryParameterValue';
import isObjectEmpty from '../../util/isObjectEmpty';
import { X as CloseIcon } from 'react-feather';
import FilterModal from '../../components/FilterModal';
import { fullPageLoadingIndicator } from '../../components/LoadingIndicator';
import defaultClasses from './search.css';
import PRODUCT_SEARCH from '../../queries/productSearch.graphql';

const getCategoryName = gql`
    query getCategoryName($id: Int!) {
        category(id: $id) {
            name
        }
    }
`;

export class Search extends Component {
    static propTypes = {
        classes: shape({
            noResult: string,
            root: string,
            totalPages: string
        }),
        openDrawer: func.isRequired,
        executeSearch: func.isRequired,
        history: object,
        location: object.isRequired,
        match: object,
        searchOpen: bool,
        toggleSearch: func
    };

    componentDidMount() {
        // Ensure that search is open when the user lands on the search page.
        const { location, searchOpen, toggleSearch, filterClear } = this.props;

        const inputText = getQueryParameterValue({
            location,
            queryParameter: 'query'
        });

        isObjectEmpty(getFilterParams()) && filterClear();

        if (toggleSearch && !searchOpen && inputText) {
            toggleSearch();
        }
    }

    componentDidUpdate(prevProps) {
        const queryPrev = getQueryParameterValue({
            location: prevProps.location,
            queryParameter: 'query'
        });

        const queryCurrent = getQueryParameterValue({
            location: this.props.location,
            queryParameter: 'query'
        });
        if (queryPrev !== queryCurrent) {
            this.props.filterClear();
        }
    }

    getCategoryName = (categoryId, classes) => (
        <div className={classes.categoryFilters}>
            <button
                className={classes.categoryFilter}
                onClick={this.handleClearCategoryFilter}
            >
                <small className={classes.categoryFilterText}>
                    <Query
                        query={getCategoryName}
                        variables={{ id: categoryId }}
                    >
                        {({ loading, error, data }) => {
                            if (error) return null;
                            if (loading) return 'Loading...';
                            return data.category.name;
                        }}
                    </Query>
                </small>
                <Icon
                    src={CloseIcon}
                    attrs={{
                        width: '13px',
                        height: '13px'
                    }}
                />
            </button>
        </div>
    );

    handleClearCategoryFilter = () => {
        const inputText = getQueryParameterValue({
            location: this.props.location,
            queryParameter: 'query'
        });

        if (inputText) {
            this.props.executeSearch(inputText, this.props.history);
        }
    };

    render() {
        const { classes, location, openDrawer } = this.props;
        const { getCategoryName } = this;

        const inputText = getQueryParameterValue({
            location,
            queryParameter: 'query'
        });
        const categoryId = getQueryParameterValue({
            location,
            queryParameter: 'category'
        });

        if (!inputText) {
            return <Redirect to="/" />;
        }

        const queryVariable = categoryId
            ? { inputText, categoryId }
            : { inputText };

        return (
            <Query query={PRODUCT_SEARCH} variables={queryVariable}>
                {({ loading, error, data }) => {
                    if (error) return <div>Data Fetch Error</div>;
                    if (loading) return fullPageLoadingIndicator;
                    const { products } = data;
                    const { filters, total_count, items } = products;

                    if (data.products.items.length === 0)
                        return (
                            <div className={classes.noResult}>
                                No results found!
                            </div>
                        );

                    return (
                        <article className={classes.root}>
                            <div className={classes.categoryTop}>
                                <div className={classes.totalPages}>
                                    {total_count} items{' '}
                                </div>
                                {categoryId &&
                                    getCategoryName(categoryId, classes)}
                                {filters && (
                                    <div className={classes.headerButtons}>
                                        <button
                                            onClick={openDrawer}
                                            className={classes.filterButton}
                                        >
                                            Filter
                                        </button>
                                    </div>
                                )}
                            </div>

                            {filters && <FilterModal filters={filters} />}
                            <section className={classes.gallery}>
                                <Gallery data={items} />
                            </section>
                        </article>
                    );
                }}
            </Query>
        );
    }
}

export default classify(defaultClasses)(Search);
