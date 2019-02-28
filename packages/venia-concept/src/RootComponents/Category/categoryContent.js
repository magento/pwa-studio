import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import classify from 'src/classify';
import Gallery from 'src/components/Gallery';
import Pagination from 'src/components/Pagination';
import FilterModal from 'src/components/FilterModal';
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

    render() {
        const {
            classes,
            pageControl,
            data,
            pageSize,
            openDrawer,
            closeDrawer,
            isFilterModalOpen,
            queryVariables
        } = this.props;

        const title = data ? data.category.description : null;
        const categoryTitle = data ? data.category.name : null;

        return (
            <article className={classes.root}>
                <h1 className={classes.title}>
                    {/* TODO: Switch to RichContent component from Peregrine when merged */}
                    <div
                        dangerouslySetInnerHTML={{
                            __html: title
                        }}
                    />
                    <div className={classes.categoryTitle}>{categoryTitle}</div>
                    <div className={classes.headerButtons}>
                        <button
                            onClick={openDrawer}
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
                                <FilterModal
                                    closeModalHandler={closeDrawer}
                                    isModalOpen={isFilterModalOpen}
                                    filters={filters}
                                />
                            </Fragment>
                        );
                    }}
                </Query>
            </article>
        );
    }
}

export default classify(defaultClasses)(CategoryContent);
