import React, { Fragment, useMemo, useState, useRef } from 'react';
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
        debugger;
        var minRange = Number(items[0].value.split('_')[0]);
        var maxRange = Number(items[items.length - 1].value.split('_')[1]);
    }

    const [value, setValue] = useState([
        minRange ? minRange : null,
        maxRange ? maxRange : null
    ]);

    const [isSliding, setIsSliding] = useState(false); // Track whether the user is sliding
    const sliderTimeoutRef = useRef(null);

    const handleSliderStart = () => {
        setIsSliding(true); // User started sliding
        if (sliderTimeoutRef.current) {
            clearTimeout(sliderTimeoutRef.current);
        }
    };

    const handleSliderEnd = newValue => {
        setIsSliding(false); // User stopped sliding
        // Call the actual onChange only after a brief delay (debounce)
        sliderTimeoutRef.current = setTimeout(() => {
            handleChange(newValue);
        }, 300); // Delay of 300ms after the user stops interacting with the slider
    };

    const handleChange = newValue => {
        // Remove the previous price filter from the URL
        const test = String(search).split('&');
        const filters = test.filter(element => {
            return !element.includes('price');
        });
        const newSearch = filters.join('&');
        const nextParams = new URLSearchParams(newSearch);

        // Append the new price filter range in the URL
        const DELIMITER = ',';
        const title = String(newValue.min) + '-' + String(newValue.max);
        const value = String(newValue.min) + '_' + String(newValue.max);
        nextParams.append(`${group}[filter]`, `${title}${DELIMITER}${value}`);

        // Write price filter state to history
        history.push({ pathname, search: String(nextParams) });

        // Set new value to the slider when the slider stops
        setValue(newValue);
    };

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
        history,
        minRange,
        maxRange,
        pathname,
        search,
        value,
        isSliding
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
