import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import classify from 'src/classify';
import Gallery from 'src/components/Gallery';
import Pagination from 'src/components/Pagination';
import globalClasses from 'src/index.css';
import FilterModal from './FilterModal';
import defaultClasses from './category.css';

const productsQuery = gql`
    query category($id: String!, $pageSize: Int!, $currentPage: Int!) {
        products(
            pageSize: $pageSize
            currentPage: $currentPage
            filter: { category_id: { eq: $id } }
        ) {
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
            filters {
                name
                filter_items_count
                request_var
                filter_items {
                    label
                    value_string
                }
            }
        }
    }
`;

class CategoryContent extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            title: PropTypes.string,
            headerButtons: PropTypes.string,
            filterContainer: PropTypes.string,
            gallery: PropTypes.string,
            pagination: PropTypes.string,
            filterContainer: PropTypes.string
        })
    };

    state = {
        filterModalOpen: false
    };

    filterModalSwitcher = () => {
        const { modalIsOpen } = globalClasses;
        const bodyClasses = document.querySelector('body').classList;

        bodyClasses.contains(modalIsOpen)
            ? bodyClasses.remove(modalIsOpen)
            : bodyClasses.add(modalIsOpen);
        this.setState({ filterModalOpen: !this.state.filterModalOpen });
    };

    render() {
        const {
            classes,
            pageControl,
            data,
            pageSize,
            queryVariables
        } = this.props;
        const title = data ? data.category.description : null;

        return (
            <article className={classes.root}>
                <h1 className={classes.title}>
                    {/* TODO: Switch to RichContent component from Peregrine when merged */}
                    <div
                        dangerouslySetInnerHTML={{
                            __html: title
                        }}
                    />
                    <div className={classes.headerButtons}>
                        <button
                            onClick={this.filterModalSwitcher}
                            className={classes.filterButton}
                        >
                            Filter
                        </button>
                    </div>
                </h1>
                <Query query={productsQuery} variables={{ ...queryVariables }}>
                    {({ loading, error, data }) => {
                        if (loading || error) return null;
                        const { products } = data;
                        const { items, filters } = products;
                        console.log('PROD DATA', products);
                        return (
                            <Fragment>
                                <section className={classes.gallery}>
                                    <Gallery
                                        data={items}
                                        title={title}
                                        pageSize={pageSize}
                                    />
                                </section>
                                <div className={classes.pagination}>
                                    <Pagination pageControl={pageControl} />
                                </div>
                                {this.state.filterModalOpen && (
                                    <FilterModal
                                        filters={filters}
                                        closeModalHandler={
                                            this.filterModalSwitcher
                                        }
                                    />
                                )}
                            </Fragment>
                        );
                    }}
                </Query>
            </article>
        );
    }
}

export default classify(defaultClasses)(CategoryContent);
