import React, { Fragment, useMemo } from 'react';
import { array, shape, string } from 'prop-types';
import setValidator from '@magento/peregrine/lib/validators/set';

import { mergeClasses } from '../../../classify';
import FilterItem from './filterItem';
import defaultClasses from './filterList.css';

const labels = new WeakMap();

const FilterList = props => {
    const { filterApi, filterState, group, items } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    // memoize item creation
    // search value is not referenced, so this array is stable
    const itemElements = useMemo(
        () =>
            items.map(item => {
                const { title, value } = item;
                const key = `item-${group}-${value}`;

                // create an element for each item
                const element = (
                    <li key={key} className={classes.item}>
                        <FilterItem
                            filterApi={filterApi}
                            filterState={filterState}
                            group={group}
                            item={item}
                        />
                    </li>
                );

                // associate each element with its normalized title
                // titles are not unique, so use the element as the key
                labels.set(element, title.toUpperCase() || '');

                return element;
            }),
        [classes, filterApi, filterState, group, items]
    );

    return (
        <Fragment>
            <ul className={classes.items}>{itemElements}</ul>
        </Fragment>
    );
};

FilterList.propTypes = {
    classes: shape({
        item: string,
        items: string
    }),
    filterApi: shape({}),
    filterState: setValidator,
    group: string,
    items: array
};

export default FilterList;
