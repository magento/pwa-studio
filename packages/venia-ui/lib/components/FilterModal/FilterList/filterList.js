import React, { Fragment, Suspense, lazy, useMemo, useRef } from 'react';
import { array, bool, shape, string } from 'prop-types';
import { useFieldState } from 'informed';

import { mergeClasses } from '../../../classify';
import FilterItem from './FilterItem';
import defaultClasses from './filterList.css';

const stripHtml = html => html.replace(/(<([^>]+)>)/gi, '');
const FilterSearch = lazy(() => import('../FilterSearch'));

const FilterList = props => {
    const { filterApi, filterState, id, isSwatch, items, name } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const itemsClass = isSwatch ? classes.swatches : classes.items;

    const { value: searchValue } = useFieldState('filter_search');
    const normalizedSearch = (searchValue || '').toUpperCase();
    const labelsRef = useRef(new WeakMap());

    // memoize item creation
    // search value is not referenced, so this array is stable
    const itemElements = useMemo(
        () =>
            items.map(item => {
                const { label, value_string: value } = item;
                const key = `item-${id}-${value}`;
                const title = stripHtml(label);

                // create an element for each item
                const element = (
                    <li key={key} className={classes.item}>
                        <FilterItem
                            filterApi={filterApi}
                            filterState={filterState}
                            id={id}
                            isSwatch={isSwatch}
                            title={title}
                            value={value}
                        />
                    </li>
                );

                // associate each element with its normalized title
                // titles are not unique, so use the element as the key
                labelsRef.current.set(element, title.toUpperCase() || '');

                return element;
            }),
        [classes, filterApi, filterState, id, isSwatch, items]
    );

    // filter item elements after creating them
    // this runs after each keystroke, but it's quick
    const filteredItemElements = normalizedSearch
        ? itemElements.filter(element =>
              labelsRef.current.get(element).includes(normalizedSearch)
          )
        : itemElements;

    // TODO: provide fallback content
    const searchElement = isSwatch ? (
        <Suspense fallback={null}>
            <FilterSearch name={name} />
        </Suspense>
    ) : null;

    return (
        <Fragment>
            {searchElement}
            <ul className={itemsClass}>{filteredItemElements}</ul>
        </Fragment>
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
