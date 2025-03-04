import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { array, arrayOf, shape, string, number } from 'prop-types';
import { useFilterSidebar } from '@magento/peregrine/lib/talons/FilterSidebar';

import { useStyle } from '../../classify';
import LinkButton from '../LinkButton';
import CurrentFilters from '../FilterModal/CurrentFilters';
import FilterBlock from '../FilterModal/filterBlock';
import defaultClasses from './filterSidebar.module.css';
import { useLocation } from 'react-router-dom';

const SCROLL_OFFSET = 150;

/**
 * A view that displays applicable and applied filters.
 *
 * @param {Object} props.filters - filters to display
 */
const FilterSidebar = props => {
    const { filters, filterCountToOpen, setFilterOptions } = props;
    const talonProps = useFilterSidebar({ filters });
    const {
        filterApi,
        filterItems,
        filterNames,
        filterFrontendInput,
        filterState,
        handleApply,
        handleReset
    } = talonProps;

    const filterRef = useRef();
    const classes = useStyle(defaultClasses, props.classes);
    const location = useLocation();

    //adding the price filter values to the filterstate
    const priceFilters = Array.from(filterItems, ([group]) => {
        if (group == 'price') {
            // preserve all existing params
            const params = new URLSearchParams(location.search);
            const uniqueKeys = new Set(params.keys());
            // iterate over existing param keys
            for (const key of uniqueKeys) {
                // if a key matches a known filter, add its items to the next state
                if (key == 'price[filter]') {
                    const value = params.get('price[filter]');
                    const item = {
                        title: value.split(',')[0],
                        value: value.split(',')[1]
                    };
                    const filterVar = new Set();
                    filterVar.add(item);

                    //to display the price filter value after selecting the filter
                    filterState.set('price', new Set(filterVar));
                }
            }
        }
    });

    const handleApplyFilter = useCallback(
        (...args) => {
            const filterElement = filterRef.current;
            if (
                filterElement &&
                typeof filterElement.getBoundingClientRect === 'function'
            ) {
                const filterTop = filterElement.getBoundingClientRect().top;
                const windowScrollY =
                    window.scrollY + filterTop - SCROLL_OFFSET;
                window.scrollTo(0, windowScrollY);
            }

            handleApply(...args);
        },
        [handleApply, filterRef]
    );

    useEffect(() => {
        if (filterState && setFilterOptions) {
            setFilterOptions(filterState);
        }
    }, [filterState, setFilterOptions]);

    const filtersList = useMemo(
        () =>
            Array.from(filterItems, ([group, items], iteration) => {
                const blockState = filterState.get(group);
                const groupName = filterNames.get(group);
                const frontendInput = filterFrontendInput.get(group);
                return (
                    <FilterBlock
                        key={group}
                        filterApi={filterApi}
                        filterState={blockState}
                        filterFrontendInput={frontendInput}
                        group={group}
                        items={items}
                        name={groupName}
                        onApply={handleApplyFilter}
                        initialOpen={iteration < filterCountToOpen}
                    />
                );
            }),
        [
            filterApi,
            filterItems,
            filterNames,
            filterFrontendInput,
            filterState,
            filterCountToOpen,
            handleApplyFilter
        ]
    );

    const clearAll = filterState.size ? (
        <div className={classes.action}>
            <LinkButton
                type="button"
                onClick={handleReset}
                data-cy="FilterSidebar-clearButton"
            >
                <FormattedMessage
                    id={'filterModal.action'}
                    defaultMessage={'Clear all'}
                />
            </LinkButton>
        </div>
    ) : null;

    return (
        <aside
            className={classes.root}
            ref={filterRef}
            data-cy="FilterSidebar-root"
            aria-busy="false"
        >
            <div className={classes.body}>
                <div className={classes.header}>
                    <h2
                        data-cy="FilterSidebar-headerTitle"
                        className={classes.headerTitle}
                    >
                        <FormattedMessage
                            id={'filterModal.headerTitle'}
                            defaultMessage={'Filters'}
                        />
                    </h2>
                </div>
                {priceFilters}
                <CurrentFilters
                    filterApi={filterApi}
                    filterNames={filterNames}
                    filterState={filterState}
                    onRemove={handleApplyFilter}
                />
                {clearAll}
                <ul className={classes.blocks}>{filtersList}</ul>
            </div>
        </aside>
    );
};

FilterSidebar.defaultProps = {
    filterCountToOpen: 3
};

FilterSidebar.propTypes = {
    classes: shape({
        action: string,
        blocks: string,
        body: string,
        header: string,
        headerTitle: string,
        root: string,
        root_open: string
    }),
    filters: arrayOf(
        shape({
            attribute_code: string,
            items: array
        })
    ),
    filterCountToOpen: number
};

export default FilterSidebar;
