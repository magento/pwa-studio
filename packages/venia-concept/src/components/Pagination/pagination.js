import React, { Component } from 'react';
import { func, number, object, shape, string } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import classify from 'src/classify';
import getQueryParameterValue from 'src/util/getQueryParameterValue';
import defaultClasses from './pagination.css';
import NavButton from './navButton';
import { navButtons } from './constants';

const tileBuffer = 2;

class Pagination extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        history: object,
        location: object,
        pageControl: shape({
            currentPage: number,
            setPage: func,
            totalPages: number,
            updateTotalPages: func
        })
    };

    componentDidMount() {
        // updateTotalPages pushes the current page count of a category query to
        // redux so it knows how many tiles to render even in the Query
        // component's loading state
        const { updateTotalPages, totalPages } = this.props.pageControl;
        updateTotalPages(totalPages);
        this.syncPage();
    }

    componentDidUpdate() {
        this.syncPage();
    }

    componentWillUnmount() {
        // Reset page total to keep other instances from rendering incorrectly
        const { updateTotalPages } = this.props.pageControl;
        updateTotalPages(null);
    }

    get navigationTiles() {
        const { classes, pageControl } = this.props;
        const { currentPage, totalPages } = pageControl;

        // Begin building page navigation tiles
        const tiles = [];
        const visibleBuffer = Math.min(tileBuffer * 2, totalPages - 1);
        const leadTile = this.getLeadTile(currentPage, totalPages);

        for (let i = leadTile; i <= leadTile + visibleBuffer; i++) {
            const tile = i;
            tiles.push(tile);
        }
        // End building page navigation tiles

        return tiles.map(tile => {
            const tileMarker =
                tile == currentPage ? (
                    <div className={classes.tileMarker} />
                ) : null;
            return (
                <button
                    className={classes.tileButton}
                    key={tile}
                    onClick={() => this.setPage(tile)}
                >
                    {tileMarker}
                    {tile}
                </button>
            );
        });
    }

    render() {
        const { classes } = this.props;
        const { currentPage, totalPages } = this.props.pageControl;
        const { navigationTiles } = this;

        if (!this.props.pageControl || totalPages == 1) {
            return null;
        }

        const leadTile = this.getLeadTile(currentPage, totalPages);

        const rightSkip = Math.min(
            totalPages,
            leadTile + tileBuffer * 2 + (tileBuffer + 1)
        );
        const leftSkip = Math.max(1, leadTile - (tileBuffer + 1));

        const isActiveLeft = !(currentPage == 1);
        const isActiveRight = !(currentPage == totalPages);

        return (
            <div className={classes.root}>
                <NavButton
                    name={navButtons.firstPage.name}
                    active={isActiveLeft}
                    onClick={() => this.setPage(leftSkip)}
                    buttonLabel={navButtons.firstPage.buttonLabel}
                />
                <NavButton
                    name={navButtons.prevPage.name}
                    active={isActiveLeft}
                    onClick={this.slideNavLeft}
                    buttonLabel={navButtons.prevPage.buttonLabel}
                />
                {navigationTiles}
                <NavButton
                    name={navButtons.nextPage.name}
                    active={isActiveRight}
                    onClick={this.slideNavRight}
                    buttonLabel={navButtons.nextPage.buttonLabel}
                />
                <NavButton
                    name={navButtons.lastPage.name}
                    active={isActiveRight}
                    onClick={() => this.setPage(rightSkip)}
                    buttonLabel={navButtons.lastPage.buttonLabel}
                />
            </div>
        );
    }

    setPage = (pageNumber, shouldReplace = false) => {
        const { history, location } = this.props;
        const { search } = location;
        const queryParams = new URLSearchParams(search);
        const method = shouldReplace ? 'replace' : 'push';

        queryParams.set('page', pageNumber);
        history[method]({ search: queryParams.toString() });
    };

    slideNavLeft = () => {
        const { currentPage } = this.props.pageControl;
        if (currentPage > 1) {
            this.setPage(currentPage - 1);
        }
    };

    slideNavRight = () => {
        const { currentPage, totalPages } = this.props.pageControl;
        if (currentPage < totalPages) {
            this.setPage(currentPage + 1);
        }
    };

    getLeadTile = (currentPage, totalPages) => {
        const selectedTile = currentPage;
        const leftBound = 1 + tileBuffer;
        const rightBound = totalPages - tileBuffer;

        let leadTile = selectedTile - tileBuffer;
        if (selectedTile < leftBound) {
            leadTile = 1;
        } else if (selectedTile > rightBound) {
            leadTile = Math.max(totalPages - tileBuffer * 2, 1);
        }
        return leadTile;
    };

    syncPage = () => {
        const { location, pageControl } = this.props;
        const { currentPage, setPage, totalPages } = pageControl;

        const queryPage = Math.max(
            1,
            // Note: The ~ operator is a bitwise NOT operator.
            // Bitwise NOTing any number x yields -(x + 1). For example, ~-5 yields 4.
            // Importantly, it truncates any fractional component of x. For example, ~-5.7 also yields 4.
            // For positive numbers, applying this operator twice has the same effect as Math.floor.
            ~~getQueryParameterValue({
                location,
                queryParameter: 'page'
            })
        );

        // if the page in the query string doesn't match client state
        // update client state
        if (queryPage !== currentPage) {
            // if the query page is not a valid page number
            // set it to `1` instead
            // and make sure to update the URL
            if (queryPage > totalPages) {
                this.setPage(1, true);
            } else {
                setPage(queryPage);
            }
        }
    };
}

export default compose(
    withRouter,
    classify(defaultClasses)
)(Pagination);
