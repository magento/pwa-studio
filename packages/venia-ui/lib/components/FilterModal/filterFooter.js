import React from 'react';
import { shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import Button from '../Button';
import defaultClasses from './filterFooter.css';

const FilterFooter = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { applyFilters, filterState, resetFilters } = props;
    const hasFilters = !!filterState.size;

    return (
        <div className={classes.root}>
            <Button disabled={!hasFilters} onClick={resetFilters}>
                {'Reset Filters'}
            </Button>
            <Button
                disabled={!hasFilters}
                onClick={applyFilters}
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
