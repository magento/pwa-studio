import React, { Fragment, useMemo, useCallback } from 'react';
import { array, func, number, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';
import setValidator from '@magento/peregrine/lib/validators/set';
import { useFilterList } from '@magento/peregrine/lib/talons/FilterModal';

import { useStyle } from '../../../classify';
import FilterItem from './filterItem';
import defaultClasses from './filterList.module.css';
import FilterItemRadioGroup from './filterItemRadioGroup';
import RangeSlider from '../../RangeSlider/rangeSlider';
import { useHistory, useLocation } from 'react-router-dom';

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
    const { pathname, search } = useLocation();
    const history = useHistory();
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useFilterList({ filterState, items, itemCountToShow });
    const { isListExpanded, handleListToggle } = talonProps;
    const { formatMessage } = useIntl();

    if (name === 'Price') {
        var minRange = Number(items[0].value.split('_')[0]);
        var maxRange = Number(items[items.length - 1].value.split('_')[1]);
        if (filterState !== undefined) {
            const filterArray = [...filterState];
            var currentMinVal = Number(filterArray[0]?.value?.split('_')[0]);
            var currentMaxVal = Number(filterArray[0]?.value?.split('_')[1]);
        }
    }

    const handleChange = useCallback(
        newValue => {
            const test = String(search).split('&');
            const filters = test.filter(element => {
                return !element.includes('price');
            });
            const newSearch = filters.join('&');
            const nextParams = new URLSearchParams(newSearch);

            const DELIMITER = ',';
            const title = String(newValue.min) + '-' + String(newValue.max);
            const value = String(newValue.min) + '_' + String(newValue.max);
            nextParams.append(
                `${group}[filter]`,
                `${title}${DELIMITER}${value}`
            );

            history.push({ pathname, search: String(nextParams) });
        },
        [group, history, pathname, search]
    );

    // Memoize item creation
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

        if (name === 'Price') {
            return (
                <div className={classes.root}>
                    <RangeSlider
                        min={minRange}
                        max={maxRange}
                        initialMin={currentMinVal}
                        initialMax={currentMaxVal}
                        onChange={handleChange}
                    />
                </div>
            );
        } else {
            return items.map((item, index) => {
                const { title, value } = item;
                const key = `item-${group}-${value}`;

                if (!isListExpanded && index >= itemCountToShow) {
                    return null;
                }

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
                labels.set(element, title.toUpperCase());
                return element;
            });
        }
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
        onApply,
        minRange,
        maxRange,
        currentMinVal,
        currentMaxVal,
        handleChange
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
