import React, { Component } from 'react';
import { string, number, shape } from 'prop-types';
import { compose } from 'redux';
import { connect, Query } from 'src/drivers';

import classify from 'src/classify';
import { setCurrentPage, setPrevPageTotal } from 'src/actions/catalog';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import CategoryContent from './categoryContent';
import defaultClasses from './category.css';
import categoryQuery from 'src/queries/getCategory.graphql';

class Category extends Component {
    static propTypes = {
        id: number,
        classes: shape({
            gallery: string,
            root: string,
            title: string
        }),
        currentPage: number,
        pageSize: number,
        prevPageTotal: number
    };

    // TODO: Should not be a default here, we just don't have
    // the wiring in place to map route info down the tree (yet)
    static defaultProps = {
        id: 3
    };

    componentDidUpdate(prevProps) {
        // If the current page has changed, scroll back up to the top.
        if (this.props.currentPage !== prevProps.currentPage) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        const {
            id,
            classes,
            currentPage,
            pageSize,
            prevPageTotal,
            setCurrentPage,
            setPrevPageTotal
        } = this.props;

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
                    onServer: false,
                    pageSize: Number(pageSize),
                    currentPage: Number(currentPage)
                }}
            >
                {({ loading, error, data }) => {
                    if (error) return <div>Data Fetch Error</div>;
                    // If our pagination component has mounted, then we have
                    // a total page count in the store, so we continue to render
                    // with our last known total
                    if (loading)
                        return pageControl.totalPages ? (
                            <CategoryContent
                                pageControl={pageControl}
                                pageSize={pageSize}
                            />
                        ) : (
                            loadingIndicator
                        );

                    // TODO: Retrieve the page total from GraphQL when ready
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
