import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FocusScope } from 'react-aria';
import { array, arrayOf, shape, string } from 'prop-types';
import { X as CloseIcon } from 'react-feather';
import { useFilterModal } from '@magento/peregrine/lib/talons/FilterModal';

import { useStyle } from '../../classify';
import Icon from '../Icon';
import LinkButton from '../LinkButton';
import { Portal } from '../Portal';
import CurrentFilters from './CurrentFilters';
import FilterBlock from './filterBlock';
import FilterFooter from './filterFooter';
import defaultClasses from './filterModal.module.css';

/**
 * A view that displays applicable and applied filters.
 *
 * @param {Object} props.filters - filters to display
 */
const FilterModal = props => {
    const { filters } = props;
    const { formatMessage } = useIntl();
    const talonProps = useFilterModal({ filters });
    const {
        filterApi,
        filterItems,
        filterNames,
        filterFrontendInput,
        filterState,
        handleApply,
        handleClose,
        handleReset,
        handleKeyDownActions,
        isOpen
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const modalClass = isOpen ? classes.root_open : classes.root;

    const filtersList = useMemo(
        () =>
            Array.from(filterItems, ([group, items]) => {
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
                    />
                );
            }),
        [filterApi, filterItems, filterNames, filterState, filterFrontendInput]
    );

    const filtersAriaLabel = formatMessage({
        id: 'filterModal.filters.ariaLabel',
        defaultMessage: 'Filters'
    });

    const closeAriaLabel = formatMessage({
        id: 'filterModal.filters.close.ariaLabel',
        defaultMessage: 'Close filters popup.'
    });

    const clearAllAriaLabel = formatMessage({
        id: 'filterModal.action.clearAll.ariaLabel',
        defaultMessage: 'Clear all applied filters'
    });

    const clearAll = filterState.size ? (
        <div className={classes.action}>
            <LinkButton
                type="button"
                onClick={handleReset}
                ariaLabel={clearAllAriaLabel}
                data-cy="FilterModal-clearButton"
            >
                <FormattedMessage
                    id={'filterModal.action'}
                    defaultMessage={'Clear all'}
                />
            </LinkButton>
        </div>
    ) : null;

    if (!isOpen) {
        return null;
    }

    return (
        <Portal>
            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
            <FocusScope contain restoreFocus autoFocus>
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                <aside
                    className={modalClass}
                    onKeyDown={handleKeyDownActions}
                    data-cy="FilterModal-root"
                >
                    <div className={classes.body}>
                        <div className={classes.header}>
                            <h2 className={classes.headerTitle}>
                                <FormattedMessage
                                    id={'filterModal.headerTitle'}
                                    defaultMessage={'Filters'}
                                />
                            </h2>
                            <button
                                onClick={handleClose}
                                aria-disabled={false}
                                aria-label={closeAriaLabel}
                            >
                                <Icon src={CloseIcon} />
                            </button>
                        </div>
                        <CurrentFilters
                            filterApi={filterApi}
                            filterNames={filterNames}
                            filterState={filterState}
                        />
                        {clearAll}
                        <ul
                            className={classes.blocks}
                            aria-label={filtersAriaLabel}
                        >
                            {filtersList}
                        </ul>
                    </div>
                    <FilterFooter
                        applyFilters={handleApply}
                        hasFilters={!!filterState.size}
                        isOpen={isOpen}
                    />
                </aside>
            </FocusScope>
        </Portal>
    );
};

FilterModal.propTypes = {
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
    )
};

export default FilterModal;
