import React, { useMemo } from 'react';
import { func, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';

import { useStyle } from '../../../classify';
import CurrentFilter from './currentFilter';
import defaultClasses from './currentFilters.module.css';

const CurrentFilters = props => {
    const { filterApi, filterState, onRemove } = props;
    const { removeItem } = filterApi;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    // create elements and params at the same time for efficiency
    const filterElements = useMemo(() => {
        const elements = [];
        for (const [group, items] of filterState) {
            for (const item of items) {
                const { title, value } = item || {};
                const key = `${group}::${title}_${value}`;

                elements.push(
                    <li key={key} className={classes.item}>
                        <CurrentFilter
                            group={group}
                            item={item}
                            removeItem={removeItem}
                            onRemove={onRemove}
                        />
                    </li>
                );
            }
        }

        return elements;
    }, [classes.item, filterState, removeItem, onRemove]);

    const currentFiltersAriaLabel = formatMessage({
        id: 'filterModal.currentFilters.ariaLabel',
        defaultMessage: 'Current Filters'
    });

    return (
        <ul className={classes.root} aria-label={currentFiltersAriaLabel}>
            {filterElements}
        </ul>
    );
};

CurrentFilters.defaultProps = {
    onRemove: null
};

CurrentFilters.propTypes = {
    classes: shape({
        root: string,
        item: string,
        button: string,
        icon: string
    }),
    onRemove: func
};

export default CurrentFilters;
