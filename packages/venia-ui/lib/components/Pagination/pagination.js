import React, { useMemo } from 'react';
import { func, number, shape, string } from 'prop-types';
import { usePagination } from '@magento/peregrine/lib/talons/Pagination/usePagination';

import { mergeClasses } from '../../classify';
import defaultClasses from './pagination.css';
import Tile from './tile';
import NavButton from './navButton';
import { navButtons } from './constants';

const Pagination = props => {
    const { currentPage, setPage, totalPages } = props.pageControl;

    const talonProps = usePagination({
        currentPage,
        setPage,
        totalPages
    });

    const {
        handleLeftSkip,
        handleRightSkip,
        handleNavBack,
        handleNavForward,
        isActiveLeft,
        isActiveRight,
        tiles
    } = talonProps;

    const navigationTiles = useMemo(
        () =>
            tiles.map(tileNumber => {
                return (
                    <Tile
                        isActive={tileNumber === currentPage}
                        key={tileNumber}
                        number={tileNumber}
                        onClick={setPage}
                    />
                );
            }),
        [currentPage, tiles, setPage]
    );

    if (totalPages === 1) {
        return null;
    }

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <NavButton
                name={navButtons.firstPage.name}
                active={isActiveLeft}
                onClick={handleLeftSkip}
                buttonLabel={navButtons.firstPage.buttonLabel}
            />
            <NavButton
                name={navButtons.prevPage.name}
                active={isActiveLeft}
                onClick={handleNavBack}
                buttonLabel={navButtons.prevPage.buttonLabel}
            />
            {navigationTiles}
            <NavButton
                name={navButtons.nextPage.name}
                active={isActiveRight}
                onClick={handleNavForward}
                buttonLabel={navButtons.nextPage.buttonLabel}
            />
            <NavButton
                name={navButtons.lastPage.name}
                active={isActiveRight}
                onClick={handleRightSkip}
                buttonLabel={navButtons.lastPage.buttonLabel}
            />
        </div>
    );
};

Pagination.propTypes = {
    classes: shape({
        root: string
    }),
    pageControl: shape({
        currentPage: number,
        setPage: func,
        totalPages: number
    }).isRequired
};

export default Pagination;
