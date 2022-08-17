import React, { useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { arrayOf, shape, string } from 'prop-types';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import filterByIcon from './Icons/filterByIcon.svg';

import { useStyle } from '@magento/venia-ui/lib/classify';
import FilterItem from './filterItem';
import defaultClasses from './ticketFilter.module.css';

import { useTicketFilter } from '../../talons/useTicketFilter';

const TicketFilter = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { filterProps, setFilterByType, setFilterByStatus } = props;
    const [currentFilter, setFilter] = filterProps;
    const { elementRef, expanded, setExpanded } = useDropdown();
    const { formatMessage } = useIntl();

    const talonProps = useTicketFilter({ setFilterByType, setFilterByStatus });
    const { filterByFunction, activeFilterByType, setActiveFilterByType, activeFilterByStatus, setActiveFilterByStatus } = talonProps;

    // click event for menu items
    const handleItemClick = useCallback(
        filterId => {
            setFilter({
                filterText: filterId.text,
                filterId: filterId.id,
                filterAttribute: filterId.attribute,
                filterValue: filterId.filterValue,
                filterGroupId: filterId.groupId,
            });

            if (filterId.attribute === 'type') {  
                if (activeFilterByType.includes(filterId.groupId) == false) {
                    setActiveFilterByType([...activeFilterByType, filterId.groupId]);
                }
                else {
                    setActiveFilterByType(activeFilterByType.filter(item => item !== filterId.groupId));
                }
            } else {
                if (activeFilterByStatus.includes(filterId.groupId) == false) {
                    setActiveFilterByStatus([...activeFilterByStatus, filterId.groupId]);
                }
                else {
                    setActiveFilterByStatus(activeFilterByStatus.filter(item => item !== filterId.groupId));
                }
            }

            setExpanded(false);
            filterByFunction(filterId);
        },
        [setFilter, setExpanded, filterByFunction, activeFilterByStatus, activeFilterByType, setActiveFilterByType, setActiveFilterByStatus]
    );

    const filterElements = useMemo(() => {
        // should be not render item in collapsed mode.
        if (!expanded) {
            return null;
        }

        const defaultfilterMethods = [
            {
                id: 'filterItem.typeSupportIssue',
                text: formatMessage({
                    id: 'filterItem.typeSupportIssue',
                    defaultMessage: 'Type: Support issue'
                }),
                attribute: 'type',
                filterValue: 'Support Issue',
                groupId: 3
            },
            {
                id: 'filterItem.typeOrderIssue',
                text: formatMessage({
                    id: 'filterItem.typeOrderIssue',
                    defaultMessage: 'Type: Order issue'
                }),
                attribute: 'type',
                filterValue: 'Order Issue',
                groupId: 2
            },
            {
                id: 'filterItem.typeEnhancement',
                text: formatMessage({
                    id: 'filterItem.typeEnhancement',
                    defaultMessage: 'Type: Enhancement'
                }),
                attribute: 'type',
                filterValue: 'Enhancement',
                groupId: 1
            },
            {
                id: 'filterItem.statusOpen',
                text: formatMessage({
                    id: 'filterItem.statusOpen',
                    defaultMessage: 'Status: Open'
                }),
                attribute: 'status',
                filterValue: 'New',
                groupId: 1
            },
            {
                id: 'filterItem.statusClosed',
                text: formatMessage({
                    id: 'filterItem.statusClosed',
                    defaultMessage: 'Status: Closed'
                }),
                attribute: 'status',
                filterValue: 'Closed',
                groupId: 4
            }
        ];

        const itemElements = Array.from(defaultfilterMethods, filterItem => {
            const { attribute, filterValue, groupId } = filterItem;
            
            var isActive = false;
            
            if (attribute === 'type') {
                isActive = activeFilterByType.includes(groupId);
            }
            else {
                isActive = activeFilterByStatus.includes(groupId);
            }

            const key = `${attribute}--${filterValue}`;
            return (
                <li key={key} className={classes.menuItem}>
                    <FilterItem filterItem={filterItem} active={isActive ? true : false} onClick={handleItemClick} />
                </li>
            );
        });

        return (
            <div className={classes.root}>
                <div className={classes.menu}>
                    <ul>{itemElements}</ul>
                </div>
            </div>
        );
    }, [expanded, formatMessage, classes.root, classes.menu, classes.menuItem, handleItemClick, activeFilterByType, activeFilterByStatus]);

    // expand or collapse on click
    const handleFilterClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div ref={elementRef}>
            <img src={filterByIcon} alt="filter" onClick={handleFilterClick} className={classes.orderByIcon} />
            {filterElements}
        </div>
    );
};

TicketFilter.propTypes = {
    classes: shape({
        menuItem: string,
        menu: string,
        root: string,
        filterButton: string
    }),
    availablefilterMethods: arrayOf(
        shape({
            label: string,
            value: string
        })
    )
};

export default TicketFilter;
