import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import debounce from 'lodash.debounce';
import classify from 'src/classify';
import SuggestedCategories from './suggestedCategories';
import SuggestedProducts from './suggestedProducts';
import PRODUCT_SEARCH from '../../queries/productSearch.graphql';

import defaultClasses from './autocomplete.css';

const debounceTimeout = 200;
const suggestedCategoriesLimit = 4;
const suggestedProductsLimit = 3;

class SearchAutocomplete extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            statusContent: PropTypes.string
        }),
        searchQuery: PropTypes.string.isRequired,
        autocompleteVisible: PropTypes.bool,
        updateAutocompleteVisible: PropTypes.func.isRequired
    };

    state = {
        autocompleteQuery: ''
    };

    componentDidUpdate = prevProps => {
        const { searchQuery } = this.props;

        if (prevProps.searchQuery !== searchQuery) {
            this.updateAutocompleteQuery(searchQuery);
        }
    };

    /* Debounce this update in order to avoid multiple autocomplete query calls */
    updateAutocompleteQuery = debounce(value => {
        this.setState({
            autocompleteQuery: value
        });
    }, debounceTimeout);

    handleCategorySearch = event => {
        event.preventDefault();
        const { id } = event.currentTarget.dataset || event.srcElement.dataset;
        this.props.updateAutocompleteVisible(false);
        this.props.executeSearch(
            this.state.autocompleteQuery,
            this.props.history,
            id
        );
    };

    handleOnProductOpen = () => this.props.updateAutocompleteVisible(false);

    render() {
        const { classes, autocompleteVisible } = this.props;
        const { handleOnProductOpen, handleCategorySearch } = this;
        const { autocompleteQuery } = this.state;

        if (!autocompleteVisible || autocompleteQuery.length < 3) return null;

        return (
            <Query
                query={PRODUCT_SEARCH}
                variables={{
                    inputText: autocompleteQuery
                }}
            >
                {({ loading, error, data }) => {
                    if (error)
                        return (
                            <div className={classes.root}>
                                <div className={classes.statusContent}>
                                    Data Fetch Error
                                </div>
                            </div>
                        );
                    if (loading)
                        return (
                            <div className={classes.root}>
                                <div className={classes.statusContent}>
                                    Fetching Data
                                </div>
                            </div>
                        );

                    const { filters, items } = data.products;

                    if (items.length <= 0)
                        return (
                            <div className={classes.root}>
                                <div className={classes.statusContent}>
                                    No results found, try a different search
                                </div>
                            </div>
                        );

                    const categoryFilter = filters.find(
                        filter => filter.name === 'Category'
                    );

                    const categorySuggestions = categoryFilter[
                        'filter_items'
                    ].slice(0, suggestedCategoriesLimit);

                    return (
                        <div className={classes.root}>
                            <SuggestedCategories
                                handleCategorySearch={handleCategorySearch}
                                autocompleteQuery={autocompleteQuery}
                                categorySuggestions={categorySuggestions}
                            />
                            <SuggestedProducts
                                handleOnProductOpen={handleOnProductOpen}
                                handleCategorySearch={handleCategorySearch}
                                items={items.slice(0, suggestedProductsLimit)}
                            />
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default classify(defaultClasses)(SearchAutocomplete);
