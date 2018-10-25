import React, { Component } from 'react';
import { string, number, shape } from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import classify from 'src/classify';
import Gallery from 'src/components/Gallery';
import Pagination from 'src/components/Pagination';
import Page from 'src/components/Page';
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
        lastPageTotal: 0
    };

    render() {
        const { id, classes } = this.props;
        const { pageSize, currentPage } = this.state;

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
                            return this.state.lastPageTotal != 0 ? (
                                this.getCategoryComponent(
                                    this.state.lastPageTotal
                                )
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

                        return this.getCategoryComponent(totalPages, data);
                    }}
                </Query>
            </Page>
        );
    }

    setPage = newPageNumber => {
        newPageNumber = newPageNumber < 1 ? 1 : newPageNumber;
        this.setState({
            currentPage: newPageNumber
        });
    };

    updateTotalPages = newTotal => {
        this.setState({
            lastPageTotal: newTotal
        });
    };

    getCategoryComponent = (totalPages, data) => {
        const { classes } = this.props;
        const items = data ? data.category.products.items : null;
        const title = data ? data.category.description : null;

        const pageControl = {
            currentPage: this.state.currentPage,
            setPage: this.setPage,
            updateTotalPages: this.updateTotalPages,
            totalPages: totalPages
        };

        return (
            <article className={classes.root}>
                <h1 className={classes.title}>
                    {/* TODO: Switch to RichContent component from Peregrine when merged */}
                    <span
                        dangerouslySetInnerHTML={{
                            __html: title
                        }}
                    />
                </h1>
                <section className={classes.gallery}>
                    <Gallery data={items} title={title} />
                </section>
                <div className={classes.pagination}>
                    <Pagination pageControl={pageControl} />
                </div>
            </article>
        );
    };
}

export default classify(defaultClasses)(Category);
