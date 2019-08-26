import React, { Component } from 'react';
import { func, number, shape, string } from 'prop-types';

import classify from '../../classify';
import defaultClasses from './pagination.css';
import Tile from './tile';
import NavButton from './navButton';
import { navButtons } from './constants';

const tileBuffer = 2;

class Pagination extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        pageControl: shape({
            currentPage: number,
            setPage: func,
            totalPages: number
        })
    };

    get navigationTiles() {
        const { pageControl } = this.props;
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

        return tiles.map(tileNumber => {
            return (
                <Tile
                    isActive={tileNumber === currentPage}
                    key={tileNumber}
                    number={tileNumber}
                    onClick={setPage}
                />
            );
        });
    }

    render() {
        const { classes } = this.props;
        const { currentPage, totalPages } = this.props.pageControl;

        if (!this.props.pageControl || totalPages == 1) {
            return null;
        }

        const { navigationTiles } = this;
        const isActiveLeft = !(currentPage == 1);
        const isActiveRight = !(currentPage == totalPages);

        return (
            <div className={classes.root}>
                <NavButton
                    name={navButtons.firstPage.name}
                    active={isActiveLeft}
                    onClick={this.leftSkip}
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
                    onClick={this.rightSkip}
                    buttonLabel={navButtons.lastPage.buttonLabel}
                />
            </div>
        );
    }

    leftSkip = () => {
        const { currentPage, setPage, totalPages } = this.props.pageControl;
        const leadTile = this.getLeadTile(currentPage, totalPages);

        const leftSkip = Math.max(1, leadTile - (tileBuffer + 1));

        setPage(leftSkip);
    };

    rightSkip = () => {
        const { currentPage, setPage, totalPages } = this.props.pageControl;
        const leadTile = this.getLeadTile(currentPage, totalPages);
        const rightSkip = Math.min(
            totalPages,
            leadTile + tileBuffer * 2 + (tileBuffer + 1)
        );

        setPage(rightSkip);
    };

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

export default classify(defaultClasses)(Pagination);
