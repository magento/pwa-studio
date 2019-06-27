import React, { Component } from 'react';
import { func, number, object, shape, string } from 'prop-types';
import { withRouter } from 'src/drivers';
import { compose } from 'redux';

import classify from 'src/classify';
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

    get navigationTiles() {
        const { classes, pageControl } = this.props;
        const { currentPage, setPage, totalPages } = pageControl;

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
                    onClick={() => setPage(tile)}
                >
                    {tileMarker}
                    {tile}
                </button>
            );
        });
    }

    render() {
        const { classes } = this.props;
        const { currentPage, setPage, totalPages } = this.props.pageControl;
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
                    onClick={() => setPage(leftSkip)}
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
                    onClick={() => setPage(rightSkip)}
                    buttonLabel={navButtons.lastPage.buttonLabel}
                />
            </div>
        );
    }

    slideNavLeft = () => {
        const { currentPage, setPage } = this.props.pageControl;
        if (currentPage > 1) {
            setPage(currentPage - 1);
        }
    };

    slideNavRight = () => {
        const { currentPage, setPage, totalPages } = this.props.pageControl;
        if (currentPage < totalPages) {
            setPage(currentPage + 1);
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
}

export default compose(
    withRouter,
    classify(defaultClasses)
)(Pagination);
