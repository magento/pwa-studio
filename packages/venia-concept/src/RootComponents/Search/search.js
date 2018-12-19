import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getSearchParams } from 'src/util/getSearchParams';
import gql from 'graphql-tag';
import Gallery from 'src/components/Gallery';
import classify from 'src/classify';
import Icon from 'src/components/Icon';
import { executeSearch } from 'src/actions/app';

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
                    name="x"
                    attrs={{
                        width: '13px',
                        height: '13px'
                    }}
                />
            </button>
        </div>
    );

    handleClearCategoryFilter = () => {
        const { inputText } = getSearchParams(location);
        if (inputText) this.props.executeSearch(inputText, this.props.history);
    };

    render() {
        const { classes } = this.props;
        const { getCategoryName } = this;

        const { inputText, categoryId } = getSearchParams(location);

        if (!inputText) return <Redirect to="/" />;

        const queryVariable = categoryId
            ? { inputText, categoryId }
            : { inputText };

        return (
            <Query query={PRODUCT_SEARCH} variables={queryVariable}>
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
                            <div className={classes.categoryTop}>
                                <div className={classes.totalPages}>
                                    {data.products.total_count} items{' '}
                                </div>
                                {categoryId &&
                                    getCategoryName(categoryId, classes)}
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

const mapDispatchToProps = { executeSearch };

export default compose(
    withRouter,
    connect(
        null,
        mapDispatchToProps
    ),
    classify(defaultClasses)
)(Search);
