import React, { Component } from 'react';
import { compose } from 'redux';
import { Query } from 'react-apollo';
import queryString from 'query-string';
import Gallery from 'src/components/Gallery';
import gql from 'graphql-tag';
import classify from 'src/classify';
import defaultClasses from './search.css';
import { withRouter } from 'react-router';
import productSearchQuery from '../../queries/productSearch.graphql';

const getCategoryName = gql`
    query getCategoryName($id: Int!) {
        category(id: $id) {
            name
        }
    }
`;

export class Search extends Component {
    getCategoryName = categoryId => (
        <Query query={getCategoryName} variables={{ id: categoryId }}>
            {({ loading, error, data }) => {
                if (loading || error) return null;

                return `in ${data.category.name}`;
            }}
        </Query>
    );

    render() {
        const { classes } = this.props;
        const { getCategoryName } = this;

        const params = queryString.parse(this.props.location.search);
        const { query: inputText, category: categoryId } = params;

        const queryVariables = {
            inputText,
            categoryId
        };

        return (
            <Query query={productSearchQuery} variables={queryVariables}>
                {({ loading, error, data }) => {
                    if (error) return <div>Data Fetch Error</div>;
                    if (loading) return <div>Fetching Data</div>;
                    if (data.products.items.length === 0)
                        return (
                            <div className={classes.noResult}>
                                No results found!
                            </div>
                        );

                    return (
                        <article className={classes.root}>
                            <div className={classes.totalPages}>
                                <span>
                                    {data.products.total_count} items{' '}
                                    {categoryId && getCategoryName(categoryId)}
                                </span>
                            </div>
                            <section className={classes.gallery}>
                                <Gallery data={data.products.items} />
                            </section>
                        </article>
                    );
                }}
            </Query>
        );
    }
}

export default compose(
    withRouter,
    classify(defaultClasses)
)(Search);
