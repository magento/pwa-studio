import React, { Component } from 'react';
import classify from 'src/classify';
import defaultClasses from './pagination.css';
import Icon from '../Icon';

class Pagination extends Component {

    state = {
        leadTile: 1,
        tileBuffer: 3,
        isAnchoredLeft: true,
        isAnchoredRight: false
    };

    componentWillMount() {
        this.setLeadTile();
    }

    get navigationTiles() {
        const { classes, pageControl } = this.props;
        const { currentPage, totalPages } = pageControl;

        if (totalPages == 1) {
            return null;
        }

        // Begin building page navigation
        const tiles = [];
        const buffer = Math.min(this.state.tileBuffer * 2, totalPages - 1);
        let leadTile = this.state.leadTile;

        for (let i = leadTile; i <= leadTile + buffer; i++) {
            const tile = i;
            tiles.push(tile);
        }
        // End building page navigation

        return tiles.map(tile => {
            const className = tile == currentPage
                ? classes.selected + ' ' + classes.tile
                : classes.tile;
            return (
                <button
                    className={className}
                    key={tile}
                    onClick={() => this.setPage(tile)}
                >
                    {tile}
                </button>
            )
        });
    }

    render() {
        const { classes, pageControl } = this.props;
        const { navigationTiles } = this;
        const sliderClassLeft = pageControl.currentPage == 1
            ? classes.slider + ' ' + classes.slider_inactive
            : classes.slider;
        const sliderClassRight = pageControl.currentPage == pageControl.totalPages
            ? classes.slider + ' ' + classes.slider_inactive
            : classes.slider;
        return (
            <div className={classes.pageNav}>
                <button className={sliderClassLeft} onClick={this.slideNavLeft}>
                    <Icon name='chevron-left'/>
                </button>
                {navigationTiles}
                <button className={sliderClassRight} onClick={this.slideNavRight}>
                    <Icon name='chevron-right'/>
                </button>
            </div>
        );
    }

    setPage = pageNumber => {
        this.props.pageControl.setPage(pageNumber);
    };

    slideNavLeft = async () => {
        const { setPage, currentPage } = this.props.pageControl;
        if (currentPage > 1) {
            await setPage(currentPage - 1);
            this.setLeadTile();
        }
    }

    slideNavRight = async () => {
        const { setPage, currentPage, totalPages } = this.props.pageControl;
        if (currentPage < totalPages) {
            await setPage(currentPage + 1);
            this.setLeadTile();
        }
    }

    setLeadTile = () => {
        const { currentPage, totalPages } = this.props.pageControl;
        const { tileBuffer } = this.state;

        const selectedTile = currentPage;
        const leftBound = 1 + tileBuffer;
        const rightBound = totalPages - tileBuffer;
        let anchorLeft = false;
        let anchorRight = false;

        let leadTile = selectedTile - tileBuffer;
        if (selectedTile < leftBound) {
            leadTile = 1;
            anchorLeft = true;
        }
        else if (selectedTile > rightBound) {
            leadTile = Math.max(totalPages - (tileBuffer * 2), 1);
            anchorRight = true;
        }
        this.setState({
            leadTile: leadTile,
            isAnchoredLeft: anchorLeft,
            isAnchoredRight: anchorRight
        });
    }
}

export default classify(defaultClasses)(Pagination);
