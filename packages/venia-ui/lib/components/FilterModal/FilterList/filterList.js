import React, { Fragment, useMemo } from 'react';
import { array, shape, string, func, number, bool } from 'prop-types';
import { useIntl } from 'react-intl';
import setValidator from '@magento/peregrine/lib/validators/set';
import { useFilterList } from '@magento/peregrine/lib/talons/FilterModal';

import { useStyle } from '../../../classify';
import FilterItem from './filterItem';
import defaultClasses from './filterList.css';

const labels = new WeakMap();

const FilterList = props => {
    const {
        filterApi,
        filterState,
        group,
        itemCountToShow,
        items,
        isExpanded,
        onApply
    } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useFilterList();
    const { isListExpanded, handleListToggle } = talonProps;
    const { formatMessage } = useIntl();

    // memoize item creation
    // search value is not referenced, so this array is stable
    const itemElements = useMemo(
        () =>
            items.map((item, index) => {
                const { title, value } = item;
                const key = `item-${group}-${value}`;
                const itemClass =
                    isListExpanded || index < itemCountToShow
                        ? classes.item
                        : classes.itemHidden;

                // create an element for each item
                const element = (
                    <li key={key} className={itemClass}>
                        <FilterItem
                            filterApi={filterApi}
                            filterState={filterState}
                            group={group}
                            item={item}
                            onApply={onApply}
                            isExpanded={isExpanded}
                        />
                    </li>
                );

                // associate each element with its normalized title
                // titles are not unique, so use the element as the key
                labels.set(element, title.toUpperCase() || '');

                return element;
            }),
        [
            classes,
            filterApi,
            filterState,
            group,
            items,
            isExpanded,
            isListExpanded,
            itemCountToShow,
            onApply
        ]
    );

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
    itemCountToShow: 5,
    isExpanded: false
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
    onApply: func,
    itemCountToShow: number,
    isExpanded: bool
};

export default FilterList;
