import React, { Component } from 'react';
import classify from 'src/classify';
import defaultClasses from './pagination.css';
import NavButton from './navButton';

const tileBuffer = 2;

class Pagination extends Component {
    componentDidMount() {
        const { updateTotalPages, totalPages } = this.props.pageControl;
        updateTotalPages(totalPages);
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
                <button key={tile} onClick={() => this.setPage(tile)}>
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
                    name="rewind"
                    active={isActiveLeft}
                    onClick={() => this.setPage(leftSkip)}
                />
                <NavButton
                    name="chevron-left"
                    active={isActiveLeft}
                    onClick={this.slideNavLeft}
                />
                {navigationTiles}
                <NavButton
                    name="chevron-right"
                    active={isActiveRight}
                    onClick={this.slideNavRight}
                />
                <NavButton
                    name="fast-forward"
                    active={isActiveRight}
                    onClick={() => this.setPage(rightSkip)}
                />
            </div>
        );
    }

    setPage = pageNumber => {
        this.props.pageControl.setPage(pageNumber);
    };

    slideNavLeft = () => {
        const { setPage, currentPage } = this.props.pageControl;
        if (currentPage > 1) {
            setPage(currentPage - 1);
        }
    };

    slideNavRight = () => {
        const { setPage, currentPage, totalPages } = this.props.pageControl;
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

export default classify(defaultClasses)(Pagination);
