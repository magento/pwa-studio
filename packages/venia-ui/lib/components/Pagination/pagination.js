import React, { useMemo } from 'react';
import { func, number, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';
import { usePagination } from '@magento/peregrine/lib/talons/Pagination/usePagination';

import { useStyle } from '../../classify';
import defaultClasses from './pagination.module.css';
import Tile from './tile';
import NavButton from './navButton';
import { navButtons } from './constants';

const Pagination = props => {
    const { currentPage, setPage, totalPages } = props.pageControl;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

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

    return (
        <div className={classes.root} data-cy="Pagination-root">
            <NavButton
                name={navButtons.firstPage.name}
                active={isActiveLeft}
                onClick={handleLeftSkip}
                buttonLabel={formatMessage({
                    id: 'pagination.firstPage',
                    defaultMessage: navButtons.firstPage.buttonLabel
                })}
            />
            <NavButton
                name={navButtons.prevPage.name}
                active={isActiveLeft}
                onClick={handleNavBack}
                buttonLabel={formatMessage({
                    id: 'pagination.prevPage',
                    defaultMessage: navButtons.prevPage.buttonLabel
                })}
            />
            {navigationTiles}
            <NavButton
                name={navButtons.nextPage.name}
                active={isActiveRight}
                onClick={handleNavForward}
                buttonLabel={formatMessage({
                    id: 'pagination.nextPage',
                    defaultMessage: navButtons.nextPage.buttonLabel
                })}
            />
            <NavButton
                name={navButtons.lastPage.name}
                active={isActiveRight}
                onClick={handleRightSkip}
                buttonLabel={formatMessage({
                    id: 'pagination.lastPage',
                    defaultMessage: navButtons.lastPage.buttonLabel
                })}
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
