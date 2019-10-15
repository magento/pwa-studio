import React, { useReducer } from 'react';
import { array, bool, shape, string } from 'prop-types';
import { Form } from 'informed';

import { mergeClasses } from '../../../classify';
import FilterSearch from '../FilterSearch';
import FilterItem from './FilterItem';
import defaultClasses from './filterList.css';

const init = () => new Map();

const reducer = (state, action) => {
    const { payload, type } = action;
    console.log({ payload, type });

    switch (type) {
        case 'clear': {
            return init();
        }
        case 'add item': {
            const { group, item } = payload;
            const nextState = new Map(state);
            const nextSet = new Set(state.get(group));

            nextSet.add(item);
            nextState.set(group, nextSet);

            return nextState;
        }
        case 'remove item': {
            const { group, item } = payload;
            const nextState = new Map(state);
            const nextSet = new Set(state.get(group));

            nextSet.delete(item);
            nextState.set(group, nextSet);

            return nextState;
        }
        case 'toggle item': {
            const { group, item } = payload;
            const nextState = new Map(state);
            const nextSet = new Set(state.get(group));

            if (nextSet.has(item)) {
                nextSet.delete(item);
            } else {
                nextSet.add(item);
            }
            nextState.set(group, nextSet);

            return nextState;
        }
    }
};

const useFilterState = () => useReducer(reducer, null, init);

const FilterList = props => {
    const { id, isSwatch, items } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const [filterState, dispatch] = useFilterState();

    const itemElements = items.map(item => {
        const key = `item-${id}-${item.value_string}`;

        return (
            <li key={key} className={classes.item}>
                <FilterItem
                    dispatch={dispatch}
                    filterState={filterState}
                    group={id}
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
