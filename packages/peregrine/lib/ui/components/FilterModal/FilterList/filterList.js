import React, { Fragment, useMemo } from 'react';
import { array, func, number, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';
import setValidator from '@magento/peregrine/lib/validators/set';
import { useFilterList } from '@magento/peregrine/lib/talons/FilterModal';

import { useStyle } from '../../../classify';
import FilterItem from './filterItem';
import defaultClasses from './filterList.module.css';
import FilterItemRadioGroup from './filterItemRadioGroup';

const labels = new WeakMap();

const FilterList = props => {
    const {
        filterApi,
        filterState,
        filterFrontendInput,
        name,
        group,
        itemCountToShow,
        items,
        onApply
    } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useFilterList({ filterState, items, itemCountToShow });
    const { isListExpanded, handleListToggle } = talonProps;
    const { formatMessage } = useIntl();

    // memoize item creation
    // search value is not referenced, so this array is stable
    const itemElements = useMemo(() => {
        if (filterFrontendInput === 'boolean') {
            const key = `item-${group}`;
            return (
                <li
                    key={key}
                    className={classes.item}
                    data-cy="FilterList-item"
                >
                    <FilterItemRadioGroup
                        filterApi={filterApi}
                        filterState={filterState}
                        group={group}
                        name={name}
                        items={items}
                        onApply={onApply}
                        labels={labels}
                    />
                </li>
            );
        }

        return items.map((item, index) => {
            const { title, value } = item;
            const key = `item-${group}-${value}`;

            if (!isListExpanded && index >= itemCountToShow) {
                return null;
            }

            // create an element for each item
            const element = (
                <li
                    key={key}
                    className={classes.item}
                    data-cy="FilterList-item"
                >
                    <FilterItem
                        filterApi={filterApi}
                        filterState={filterState}
                        group={group}
                        item={item}
                        onApply={onApply}
                    />
                </li>
            );

            // associate each element with its normalized title
            // titles are not unique, so use the element as the key
            labels.set(element, title.toUpperCase());
            return element;
        });
    }, [
        classes,
        filterApi,
        filterState,
        filterFrontendInput,
        name,
        group,
        items,
        isListExpanded,
        itemCountToShow,
        onApply
    ]);

    const showMoreLessItem = useMemo(() => {
        if (items.length <= itemCountToShow) {
            return null;
        }

        const label = isListExpanded
            ? formatMessage({
                  id: 'filterList.showLess',
                  defaultMessage: 'Show Less'
              })
            : formatMessage({
                  id: 'filterList.showMore',
                  defaultMessage: 'Show More'
              });

        return (
            <li className={classes.showMoreLessItem}>
                <button
                    onClick={handleListToggle}
                    className={classes.showMoreLessButton}
                    data-cy="FilterList-showMoreLessButton"
                >
                    {label}
                </button>
            </li>
        );
    }, [
        isListExpanded,
        handleListToggle,
        items,
        itemCountToShow,
        formatMessage,
        classes
    ]);

    return (
        <Fragment>
            <ul className={classes.items}>
                {itemElements}
                {showMoreLessItem}
            </ul>
        </Fragment>
    );
};

FilterList.defaultProps = {
    onApply: null,
    itemCountToShow: 5
};

FilterList.propTypes = {
    classes: shape({
        item: string,
        items: string
    }),
    filterApi: shape({}),
    filterState: setValidator,
    name: string,
    group: string,
    items: array,
    onApply: func,
    itemCountToShow: number
};

export default FilterList;
