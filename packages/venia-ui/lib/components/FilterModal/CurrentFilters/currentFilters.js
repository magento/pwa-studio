import React, { useMemo } from 'react';
import { shape, string } from 'prop-types';

import { mergeClasses } from '../../../classify';
import CurrentFilter from './currentFilter';
import defaultClasses from './currentFilters.css';
import { useIntl } from "react-intl";

const CurrentFilters = props => {
    const { filterApi, filterState } = props;
    const { removeItem } = filterApi;
    const classes = mergeClasses(defaultClasses, props.classes);
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
                        />
                    </li>
                );
            }
        }

        return elements;
    }, [classes.item, filterState, removeItem]);

    const currentFiltersAriaLabel = formatMessage({
        id: 'filterModal.currentFilters.ariaLabel',
        defaultMessage: 'Current Filters'
    });

    return <ul className={classes.root} aria-label={currentFiltersAriaLabel}>{filterElements}</ul>;
};

CurrentFilters.propTypes = {
    classes: shape({
        root: string,
        item: string,
        button: string,
        icon: string
    })
};

export default CurrentFilters;
