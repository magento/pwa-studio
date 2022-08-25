import React from 'react';
import { useIntl } from 'react-intl';
import { bool, func, shape, string } from 'prop-types';
import { useFilterFooter } from '@magento/peregrine/lib/talons/FilterModal';

import { useStyle } from '../../classify';
import Button from '../Button';
import defaultClasses from './filterFooter.module.css';

const FilterFooter = props => {
    const { applyFilters, hasFilters, isOpen } = props;
    const { formatMessage } = useIntl();
    const { touched } = useFilterFooter({
        hasFilters,
        isOpen
    });

    const classes = useStyle(defaultClasses, props.classes);
    const buttonLabel = formatMessage({
        id: 'filterFooter.results',
        defaultMessage: 'See Results'
    });

    return (
        <div className={classes.root}>
            <Button
                disabled={!touched}
                onClick={applyFilters}
                data-cy="FilterFooter-button"
                aria-label={buttonLabel}
                aria-disabled={!touched}
                priority="high"
            >
                {buttonLabel}
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
    isOpen: bool
};

export default FilterFooter;
