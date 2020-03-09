import React, { useMemo } from 'react';
import { array, arrayOf, shape, string } from 'prop-types';
import { X as CloseIcon } from 'react-feather';
import { useFilterModal } from '@magento/peregrine/lib/talons/FilterModal';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import { Modal } from '../Modal';
import CurrentFilters from './CurrentFilters';
import FilterBlock from './filterBlock';
import FilterFooter from './filterFooter';
import defaultClasses from './filterModal.css';

import FILTER_INTROSPECTION from '../../queries/introspection/filterIntrospectionQuery.graphql';

/**
 * A view that displays applicable and applied filters.
 *
 * @param {Object} props.filters - filters to display
 */
const FilterModal = props => {
    const { filters } = props;
    const talonProps = useFilterModal({
        filters,
        queries: { filterIntrospection: FILTER_INTROSPECTION }
    });
    const {
        filterApi,
        filterItems,
        filterNames,
        filterState,
        handleApply,
        handleClose,
        handleReset,
        isOpen
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const modalClass = isOpen ? classes.root_open : classes.root;

    const filtersList = useMemo(
        () =>
            Array.from(filterItems, ([group, items]) => {
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
                    />
                );
            }),
        [filterApi, filterItems, filterNames, filterState]
    );

    return (
        <Modal>
            <aside className={modalClass}>
                <div className={classes.body}>
                    <div className={classes.header}>
                        <h2 className={classes.headerTitle}>{'Filter By'}</h2>
                        <button onClick={handleClose}>
                            <Icon src={CloseIcon} />
                        </button>
                    </div>
                    <CurrentFilters
                        filterApi={filterApi}
                        filterNames={filterNames}
                        filterState={filterState}
                    />
                    <ul className={classes.blocks}>{filtersList}</ul>
                </div>
                <FilterFooter
                    applyFilters={handleApply}
                    hasFilters={!!filterState.size}
                    isOpen={isOpen}
                    resetFilters={handleReset}
                />
            </aside>
        </Modal>
    );
};

FilterModal.propTypes = {
    classes: shape({
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
    )
};

export default FilterModal;
