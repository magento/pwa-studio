import React, { Fragment, useMemo } from 'react';
import { array, shape, string, func, number } from 'prop-types';
import { useIntl } from 'react-intl';
import setValidator from '@magento/peregrine/lib/validators/set';
import { useFilterList } from '@magento/peregrine/lib/talons/FilterModal';

import { mergeClasses } from '../../../classify';
import FilterItem from './filterItem';
import defaultClasses from './filterList.css';

const labels = new WeakMap();
const DEFAULT_SHOW_ITEMS_COUNT = 5;

const FilterList = props => {
    const { filterApi, filterState, group, items, handleApply, showItems } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const talonProps = useFilterList();
    const { isExpanded, handleClick } = talonProps;
    const showItemsCount = typeof showItems === 'number' ? showItems : DEFAULT_SHOW_ITEMS_COUNT;
    const { formatMessage } = useIntl();

    // memoize item creation
    // search value is not referenced, so this array is stable
    const itemElements = useMemo(
        () =>
            items.map((item, index) => {
                const { title, value } = item;
                const key = `item-${group}-${value}`;
                const itemClass = isExpanded || index < showItemsCount ? classes.item : classes.itemHidden;

                // create an element for each item
                const element = (
                    <li key={key} className={itemClass}>
                        <FilterItem
                            filterApi={filterApi}
                            filterState={filterState}
                            group={group}
                            item={item}
                            handleApply={handleApply}
                        />
                    </li>
                );

                // associate each element with its normalized title
                // titles are not unique, so use the element as the key
                labels.set(element, title.toUpperCase() || '');

                return element;
            }),
        [classes, filterApi, filterState, group, items, isExpanded, showItemsCount]
    );

    const showMoreLessItem = useMemo(() => {
        if (items.length <= showItemsCount) {
            return null;
        }

        const label = isExpanded
            ? formatMessage({ id: 'filterList.showLess', defaultMessage: 'Show Less' })
            : formatMessage({ id: 'filterList.showMore', defaultMessage: 'Show More' });

        return (
            <li className={classes.showMoreLessItem}>
                <button
                    onClick={handleClick}
                    className={classes.showMoreLessButton}
                >
                    {label}
                </button>
            </li>
        );
    }, [isExpanded, handleClick, items, showItemsCount, formatMessage]);

    return (
        <Fragment>
            <ul className={classes.items}>{itemElements}{showMoreLessItem}</ul>
        </Fragment>
    );
};

FilterList.defaultProps = {
    handleApply: null,
    showItems: null
};

FilterList.propTypes = {
    classes: shape({
        item: string,
        items: string
    }),
    filterApi: shape({}),
    filterState: setValidator,
    group: string,
    items: array,
    handleApply: func,
    showItems: number
};

export default FilterList;
