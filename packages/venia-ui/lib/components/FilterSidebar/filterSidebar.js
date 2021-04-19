import React, { useMemo, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { array, arrayOf, shape, string, number } from 'prop-types';
import { useFilterModal } from '@magento/peregrine/lib/talons/FilterModal';

import { mergeClasses } from '../../classify';
import LinkButton from '../LinkButton';
import CurrentFilters from '../FilterModal/CurrentFilters';
import FilterBlock from '../FilterModal/filterBlock';
import defaultClasses from './filterSidebar.css';

const DEFAULT_FILTERS_OPEN_COUNT = 3;

/**
 * A view that displays applicable and applied filters.
 *
 * @param {Object} props.filters - filters to display
 */
const FilterSidebar = props => {
    const { filters, filtersOpen } = props;
    const talonProps = useFilterModal({ filters });
    const {
        filterApi,
        filterItems,
        filterNames,
        filterState,
        handleApply,
        handleReset
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const filtersToOpen = typeof filtersOpen === 'number' ? filtersOpen : DEFAULT_FILTERS_OPEN_COUNT;

    const filtersList = useMemo(
        () =>
            Array.from(filterItems, ([group, items], iteration) => {
                const blockState = filterState.get(group);
                const groupName = filterNames.get(group);

                return (
                    <FilterBlock
                        key={group}
                        filterApi={filterApi}
                        filterState={blockState}
                        group={group}
                        items={items}
                        name={groupName}
                        handleApply={handleApply}
                        initialOpen={iteration < filtersToOpen}
                    />
                );
            }),
        [filterApi, filterItems, filterNames, filterState, filtersToOpen]
    );

    const clearAll = filterState.size ? (
        <div className={classes.action}>
            <LinkButton type="button" onClick={handleReset}>
                <FormattedMessage
                    id={'filterModal.action'}
                    defaultMessage={'Clear all'}
                />
            </LinkButton>
        </div>
    ) : null;

    return (
        <Fragment>
            <aside className={classes.root}>
                <div className={classes.body}>
                    <CurrentFilters
                        filterApi={filterApi}
                        filterNames={filterNames}
                        filterState={filterState}
                        handleApply={handleApply}
                    />
                    {clearAll}
                    <ul className={classes.blocks}>{filtersList}</ul>
                </div>
            </aside>
        </Fragment>
    );
};

FilterSidebar.defaultProps = {
    filtersOpen: null
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
    filtersOpen: number
};

export default FilterSidebar;
