import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { debounce } from 'underscore';
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
        handleOnProductOpen: PropTypes.func.isRequired,
        handleCategorySearch: PropTypes.func.isRequired
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

    /* Flatten categories array & remove duplicate categories */
    createCategorySuggestions = items =>
        items
            .map(item => item.categories)
            .reduce((categories, category) => categories.concat(category), [])
            .filter(
                (category, index, categories) =>
                    categories.indexOf(category) === index
            );

    /* Debounce this update in order to avoid multiple autocomplete query calls */
    updateAutocompleteQuery = debounce(value => {
        this.setState({
            autocompleteQuery: value
        });
    }, debounceTimeout);

    render() {
        const {
            autocompleteVisible,
            classes,
            handleCategorySearch,
            handleOnProductOpen
        } = this.props;

        const { createCategorySuggestions } = this;

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

                    const { items } = data.products;

                    if (items.length <= 0) return null;

                    const categorySuggestions = createCategorySuggestions(
                        items
                    );

                    return (
                        <div className={classes.root}>
                            <SuggestedCategories
                                handleCategorySearch={handleCategorySearch}
                                autocompleteQuery={autocompleteQuery}
                                categorySuggestions={categorySuggestions.slice(
                                    0,
                                    suggestedCategoriesLimit
                                )}
                            />
                            <SuggestedProducts
                                handleOnProductOpen={handleOnProductOpen}
                                handleCategorySearch={handleCategorySearch}
                                items={data.products.items.slice(
                                    0,
                                    suggestedProductsLimit
                                )}
                            />
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default classify(defaultClasses)(SearchAutocomplete);
