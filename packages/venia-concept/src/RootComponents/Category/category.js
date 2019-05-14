import React, { Component } from 'react';
import { string, number, shape } from 'prop-types';
import { compose } from 'redux';
import { connect, Query } from 'src/drivers';
import catalogActions from 'src/actions/catalog';
import classify from 'src/classify';
import isObjectEmpty from 'src/util/isObjectEmpty';
import { setCurrentPage, setPrevPageTotal } from 'src/actions/catalog';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import CategoryContent from './categoryContentContainer';
import defaultClasses from './category.css';
import categoryQuery from 'src/queries/getCategory.graphql';
import { getFilterParams } from 'src/util/getFilterParamsFromUrl';
class Category extends Component {
    static propTypes = {
        id: number,
        classes: shape({
            gallery: string,
            root: string,
            title: string
        }),
        currentPage: number,
        prevPageTotal: number,
        pageSize: number
    };

    // TODO: Should not be a default here, we just don't have
    // the wiring in place to map route info down the tree (yet)
    static defaultProps = {
        id: 3
    };

    componentDidMount() {
        isObjectEmpty(getFilterParams()) && this.props.filterClear();
    }

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
            prevPageTotal,
            filterClear,
            pageSize,
            setCurrentPage,
            setPrevPageTotal
        } = this.props;

        const pageControl = {
            currentPage: currentPage,
            setPage: setCurrentPage,
            updateTotalPages: setPrevPageTotal,
            totalPages: prevPageTotal
        };

        const queryVariables = {
            id: Number(id),
            onServer: false,
            pageSize: Number(pageSize),
            currentPage: Number(currentPage),
            idString: String(id)
        };

        return (
            <Query query={categoryQuery} variables={queryVariables}>
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

                    // Retrieve the total page count from GraphQL when ready
                    const pageCount = data.products.total_count / pageSize;
                    const totalPages = Math.ceil(pageCount);
                    const totalWrapper = {
                        ...pageControl,
                        totalPages: totalPages
                    };

                    return (
                        <CategoryContent
                            classes={classes}
                            filterClear={filterClear}
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

const mapDispatchToProps = dispatch => ({
    setCurrentPage: payload => dispatch(setCurrentPage(payload)),
    setPrevPageTotal: payload => dispatch(setPrevPageTotal(payload)),
    filterClear: () => dispatch(catalogActions.filterOption.clear())
});

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Category);
