import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { shape, string } from 'prop-types';

import { mergeClasses } from '../../../classify';
import CurrentFilter from './currentFilter';
import defaultClasses from './currentFilters.css';
import {
    DELIMETER,
    getFiltersFromSearch
} from '@magento/peregrine/lib/talons/FilterModal/helpers';

const CurrentFilters = props => {
    const { search } = useLocation();

    const { filterApi, filterNames } = props;
    const { removeItem } = filterApi;
    const classes = mergeClasses(defaultClasses, props.classes);

    const urlFilters = useMemo(() => getFiltersFromSearch(search), [search]);

    // TODO: Render these based on urlFilters, not filterState.
    // create elements and params at the same time for efficiency
    const filterElements = useMemo(() => {
        const elements = [];
        for (const [group, items] of urlFilters) {
            for (const item of items) {
                const [title, value] = item.split(DELIMETER);
                const key = `${group}::${title}_${value}`;
                const groupName = filterNames.get(group);

                elements.push(
                    <li key={key} className={classes.item}>
                        <CurrentFilter
                            group={group}
                            groupName={groupName}
                            item={{
                                title,
                                value
                            }}
                            removeItem={removeItem}
                        />
                    </li>
                );
            }
        }

        return elements;
    }, [classes.item, filterNames, removeItem, urlFilters]);

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
