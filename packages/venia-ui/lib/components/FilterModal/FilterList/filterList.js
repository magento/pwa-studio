import React, { useReducer } from 'react';
import { array, bool, shape, string } from 'prop-types';
import { Form } from 'informed';

import { mergeClasses } from '../../../classify';
import FilterSearch from '../FilterSearch';
import FilterItem from './FilterItem';
import defaultClasses from './filterList.css';

const FilterList = props => {
    const { filterApi, filterState, id, isSwatch, items } = props;
    const { dispatch } = filterApi;
    const classes = mergeClasses(defaultClasses, props.classes);

    const itemElements = items.map(item => {
        const key = `item-${id}-${item.value_string}`;

        return (
            <li key={key} className={classes.item}>
                <FilterItem
                    dispatch={dispatch}
                    filterState={filterState}
                    id={id}
                    isSwatch={isSwatch}
                    item={item}
                />
            </li>
        );
    });

    return (
        <Form>
            <FilterSearch name="foo" />
            <ul className={classes.items}>{itemElements}</ul>
        </Form>
    );
};

FilterList.propTypes = {
    classes: shape({
        item: string,
        items: string
    }),
    id: string,
    isSwatch: bool,
    items: array
};

export default FilterList;
