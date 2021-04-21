import React, { useMemo } from 'react';
import { shape, string, func } from 'prop-types';

import { mergeClasses } from '../../../classify';
import CurrentFilter from './currentFilter';
import defaultClasses from './currentFilters.css';

const CurrentFilters = props => {
    const { filterApi, filterState, handleApply } = props;
    const { removeItem } = filterApi;
    const classes = mergeClasses(defaultClasses, props.classes);

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
                            handleApply={handleApply}
                        />
                    </li>
                );
            }
        }

        return elements;
    }, [classes.item, filterState, removeItem, handleApply]);

    return <ul className={classes.root}>{filterElements}</ul>;
};

CurrentFilters.defaultProps = {
    handleApply: null
};

CurrentFilters.propTypes = {
    classes: shape({
        root: string,
        item: string,
        button: string,
        icon: string
    }),
    handleApply: func
};

export default CurrentFilters;
