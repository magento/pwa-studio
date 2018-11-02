import React, { Component } from 'react';
import { string, number, shape } from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import classify from 'src/classify';
import Page from 'src/components/Page';
import CategoryContent from './categoryContent';
import defaultClasses from './category.css';

const categoryQuery = gql`
    query category($id: Int!, $pageSize: Int!, $currentPage: Int!) {
        category(id: $id) {
            description
            name
            product_count
            products(pageSize: $pageSize, currentPage: $currentPage) {
                items {
                    id
                    name
                    small_image {
                        path
                    }
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
    }
`;

class Category extends Component {
    static propTypes = {
        id: number,
        classes: shape({
            gallery: string,
            root: string,
            title: string
        })
    };

    // TODO: Should not be a default here, we just don't have
    // the wiring in place to map route info down the tree (yet)
    static defaultProps = {
        id: 3
    };

    state = {
        currentPage: 1,
        pageSize: 6,
        prevPageTotal: 0
    };

    render() {
        const { id, classes } = this.props;
        const { pageSize, currentPage, prevPageTotal } = this.state;
        const pageControl = {
            currentPage: currentPage,
            setPage: this.setPage,
            updateTotalPages: this.updateTotalPages,
            totalPages: prevPageTotal
        };

        return (
            <Page>
                <Query
                    query={categoryQuery}
                    variables={{
                        id: Number(id),
                        pageSize: Number(pageSize),
                        currentPage: Number(currentPage)
                    }}
                >
                    {({ loading, error, data }) => {
                        if (error) return <div>Data Fetch Error</div>;
                        if (loading)
                            return this.state.prevPageTotal != 0 ? (
                                <CategoryContent
                                    pageControl={pageControl}
                                    pageSize={pageSize}
                                />
                            ) : (
                                <div className={classes.placeholder}>
                                    Fetching Data...
                                </div>
                            );

                        // Retrieve the total page count from GraphQL when ready
                        const pageCount =
                            data.category.products.total_count /
                            this.state.pageSize;
                        const totalPages = Math.ceil(pageCount);
                        const totalWrapper = {
                            ...pageControl,
                            totalPages: totalPages
                        };

                        return (
                            <CategoryContent
                                classes={classes}
                                pageControl={totalWrapper}
                                data={data}
                            />
                        );
                    }}
                </Query>
            </Page>
        );
    }

    setPage = newPageNumber => {
        newPageNumber = Math.max(1, newPageNumber);
        this.setState({
            currentPage: newPageNumber
        });
    };

    updateTotalPages = newTotal => {
        this.setState({
            prevPageTotal: newTotal
        });
    };
}

export default classify(defaultClasses)(Category);
