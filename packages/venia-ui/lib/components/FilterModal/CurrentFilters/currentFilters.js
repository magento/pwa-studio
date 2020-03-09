import React, { useMemo } from 'react';
import { shape, string } from 'prop-types';

import { mergeClasses } from '../../../classify';
import CurrentFilter from './currentFilter';
import defaultClasses from './currentFilters.css';

const CurrentFilters = props => {
    const { filterApi, filterNames, filterState } = props;
    const { removeItem } = filterApi;
    const classes = mergeClasses(defaultClasses, props.classes);

    // create elements and params at the same time for efficiency
    const filterElements = useMemo(() => {
        const elements = [];
        for (const [group, items] of filterState) {
            for (const item of items) {
                const { title, value } = item || {};
                const key = `${group}::${title}_${value}`;
                const groupName = filterNames.get(group);

                elements.push(
                    <li key={key} className={classes.item}>
                        <CurrentFilter
                            group={group}
                            groupName={groupName}
                            item={item}
                            removeItem={removeItem}
                        />
                    </li>
                );
            }
        }

        return elements;
    }, [classes.item, filterNames, filterState, removeItem]);

    return <ul className={classes.root}>{filterElements}</ul>;
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
