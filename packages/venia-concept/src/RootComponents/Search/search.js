import React, { Component } from 'react';
import { bool, func, object, shape, string } from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import getQueryParameterValue from '../../util/getQueryParameterValue';
import { SEARCH_QUERY_PARAMETER } from './consts';
import Gallery from 'src/components/Gallery';

import classify from 'src/classify';
import defaultClasses from './search.css';

const searchQuery = gql`
    query($inputText: String) {
        products(search: $inputText) {
            items {
                id
                name
                small_image
                url_key
                price {
                    regularPrice {
                        amount {
                            value
                            currency
                        }
                    }
                }
            }
            total_count
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
        history: object,
        location: object.isRequired,
        match: object,
        searchOpen: bool,
        toggleSearch: func
    };

    componentDidMount() {
        // Ensure that search is open when the user lands on the search page.
        const { searchOpen, toggleSearch } = this.props;
        if (toggleSearch && !searchOpen) {
            toggleSearch();
        }
    }

    render() {
        const { classes, location } = this.props;

        const userInput = getQueryParameterValue({
            location,
            queryParameter: SEARCH_QUERY_PARAMETER
        });

        return (
            <Query query={searchQuery} variables={{ inputText: userInput }}>
                {({ loading, error, data }) => {
                    if (error) return <div>Data Fetch Error</div>;
                    if (loading) return <div>Fetching Data</div>;

                    if (data.products.items.length === 0) {
                        return (
                            <div className={classes.noResult}>
                                No results found!
                            </div>
                        );
                    }

                    return (
                        <article className={classes.root}>
                            <div className={classes.totalPages}>
                                <span>{`${
                                    data.products.total_count
                                } items`}</span>
                            </div>
                            <section>
                                <Gallery data={data.products.items} />
                            </section>
                        </article>
                    );
                }}
            </Query>
        );
    }
}

export default classify(defaultClasses)(Search);
