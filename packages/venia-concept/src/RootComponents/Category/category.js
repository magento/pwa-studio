import React, { Component } from 'react';
import { string, number, shape } from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'redux';
import { connect } from 'react-redux';

import classify from 'src/classify';
import { setCurrentPage, setPrevPageTotal } from 'src/actions/catalog';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import CategoryContent from './categoryContent';
import defaultClasses from './category.css';
import getQueryParameterValue from 'src/util/getQueryParameterValue';

const categoryQuery = gql`
    query category($id: Int!, $pageSize: Int!, $currentPage: Int!) {
        category(id: $id) {
            id
            description
            name
            product_count
            products(pageSize: $pageSize, currentPage: $currentPage) {
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
    }
`;

class Category extends Component {
    static propTypes = {
        id: number,
        classes: shape({
            gallery: string,
            root: string,
            title: string
        }),
        pageSize: number,
        prevPageTotal: number
    };

    // TODO: Should not be a default here, we just don't have
    // the wiring in place to map route info down the tree (yet)
    static defaultProps = {
        id: 3
    };
   
    // gets current page from queryParam
    getCurrentPage() {
        const page = getQueryParameterValue({location:undefined,queryParameter:'page'});
        return page && page <= this.props.prevPageTotal?page:1; 
    }

    render() {
        const {
            id,
            classes,
            pageSize,
            prevPageTotal,
            setCurrentPage,
            setPrevPageTotal
        } = this.props;
        const currentPage = this.getCurrentPage();
        const pageControl = {
            currentPage: currentPage,
            setPage: setCurrentPage,
            updateTotalPages: setPrevPageTotal,
            totalPages: prevPageTotal
        };

        return (
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
                        return pageControl.totalPages ? (
                            <CategoryContent
                                pageControl={pageControl}
                                pageSize={pageSize}
                            />
                        ) : (
                            loadingIndicator
                        );

                    // Retrieve the total page count from GraphQL when ready
                    const pageCount =
                        data.category.products.total_count / pageSize;
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
        );
    }
}

const mapStateToProps = ({ catalog }) => {
    return {
        currentPage: catalog.currentPage,
        pageSize: catalog.pageSize,
        prevPageTotal: catalog.prevPageTotal
    };
};
const mapDispatchToProps = { setCurrentPage, setPrevPageTotal };

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Category);
