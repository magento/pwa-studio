import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { useFilterFooter } from '@magento/peregrine/lib/talons/FilterModal';

import { mergeClasses } from '../../classify';
import Button from '../Button';
import defaultClasses from './filterFooter.css';

const FilterFooter = props => {
    const { applyFilters, hasFilters, isOpen, resetFilters } = props;
    const { touched } = useFilterFooter({ hasFilters, isOpen });
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <Button disabled={!hasFilters} onClick={resetFilters}>
                {'Reset Filters'}
            </Button>
            <Button disabled={!touched} onClick={applyFilters} priority="high">
                {'Apply Filters'}
            </Button>
        </div>
    );
};

FilterFooter.propTypes = {
    applyFilters: func.isRequired,
    classes: shape({
        root: string
    }),
    hasFilters: bool,
    isOpen: bool,
    resetFilters: func.isRequired
};

export default FilterFooter;
