import React, { Component } from 'react';
import classify from 'src/classify';
import defaultClasses from './pagination.css';
import Icon from '../Icon';

const tileBuffer = 3;

class Pagination extends Component {
    componentDidMount() {
        const { updateTotalPages, totalPages } = this.props.pageControl;
        updateTotalPages(totalPages);
    }

    get navigationTiles() {
        const { classes, pageControl } = this.props;
        const { currentPage, totalPages } = pageControl;

        // Begin building page navigation
        const tiles = [];
        const buffer = Math.min(tileBuffer * 2, totalPages - 1);
        const leadTile = this.getLeadTile();

        for (let i = leadTile; i <= leadTile + buffer; i++) {
            const tile = i;
            tiles.push(tile);
        }
        // End building page navigation

        return tiles.map(tile => {
            const tileMarker =
                tile == currentPage ? (
                    <div id="tileMarker" className={classes.tileMarker} />
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
        const { classes, pageControl } = this.props;
        const { navigationTiles } = this;

        if (!pageControl || pageControl.totalPages == 1) {
            return null;
        }

        const sliderClassLeft =
            pageControl.currentPage == 1
                ? classes.slider + ' ' + classes.slider_inactive
                : classes.slider;
        const sliderClassRight =
            pageControl.currentPage == pageControl.totalPages
                ? classes.slider + ' ' + classes.slider_inactive
                : classes.slider;

        return (
            <div className={classes.root}>
                <button className={sliderClassLeft} onClick={this.slideNavLeft}>
                    <Icon name="chevron-left" />
                </button>
                {navigationTiles}
                <button
                    className={sliderClassRight}
                    onClick={this.slideNavRight}
                >
                    <Icon name="chevron-right" />
                </button>
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

    getLeadTile = () => {
        const { currentPage, totalPages } = this.props.pageControl;

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
