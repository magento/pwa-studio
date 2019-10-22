import React, { useCallback } from 'react';
import { shape, string } from 'prop-types';

import { mergeClasses } from '../../../classify';
import Button from '../../Button';
import defaultClasses from './filterFooter.css';

const FilterFooter = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { applyFilters, filterApi, filterState } = props;
    const { clear } = filterApi;
    const hasFilters = !!filterState.size;

    const handleApplyClick = useCallback(() => {
        applyFilters();
    }, [applyFilters]);

    const handleResetClick = useCallback(() => {
        clear();
        applyFilters();
    }, [applyFilters, clear]);

    return (
        <div className={classes.root}>
            <Button disabled={!hasFilters} onClick={handleResetClick}>
                {'Reset Filters'}
            </Button>
            <Button
                disabled={!hasFilters}
                onClick={handleApplyClick}
                priority="high"
            >
                {'Apply Filters'}
            </Button>
        </div>
    );
};

FilterFooter.propTypes = {
    classes: shape({
        root: string
    })
};

export default FilterFooter;
