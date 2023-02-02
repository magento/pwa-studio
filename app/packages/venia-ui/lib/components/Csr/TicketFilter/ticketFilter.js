/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { arrayOf, shape, string } from 'prop-types';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import filterByIcon from './Icons/filterByIcon.svg';

import { useStyle } from '@magento/venia-ui/lib/classify';
import FilterItem from './filterItem';
import defaultClasses from './ticketFilter.module.css';

import { useTicketFilter } from '@magento/peregrine/lib/talons/Csr/useTicketFilter';

const TicketFilter = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { filterProps, setFilterByType, setFilterByStatus, setNumPage, setMultipleTickets } = props;
    const [currentFilter, setFilter] = filterProps;
    const { elementRef, expanded, setExpanded } = useDropdown();
    const { formatMessage } = useIntl();

    const talonProps = useTicketFilter({ setFilterByType, setFilterByStatus, setNumPage, setMultipleTickets });
    const {
        filterByFunction,
        activeFilterByType,
        setActiveFilterByType,
        activeFilterByStatus,
        setActiveFilterByStatus,
        states,
        groups
    } = talonProps;

    // click event for menu items
    const handleItemClick = useCallback(
        filterId => {
            setFilter({
                filterText: filterId.text,
                filterId: filterId.id,
                filterAttribute: filterId.attribute,
                filterValue: filterId.filterValue,
                filterGroupId: filterId.groupId
            });

            if (filterId.attribute === 'type') {
                if (activeFilterByType.includes(filterId.groupId) == false) {
                    setActiveFilterByType([...activeFilterByType, filterId.groupId]);
                } else {
                    setActiveFilterByType(activeFilterByType.filter(item => item !== filterId.groupId));
                }
            } else {
                if (activeFilterByStatus.includes(filterId.groupId) == false) {
                    setActiveFilterByStatus([...activeFilterByStatus, filterId.groupId]);
                } else {
                    setActiveFilterByStatus(activeFilterByStatus.filter(item => item !== filterId.groupId));
                }
            }

            setExpanded(false);
            filterByFunction(filterId);
        },
        [
            setFilter,
            setExpanded,
            filterByFunction,
            activeFilterByStatus,
            activeFilterByType,
            setActiveFilterByType,
            setActiveFilterByStatus
        ]
    );

    const filterElements = useMemo(() => {
        // should be not render item in collapsed mode.
        if (!expanded) {
            return null;
        }

        const filterTypeItems = Object.keys(groups).map(key => {
            return {
                id: 'filterItem.type' + groups[key].replace(/ /g, ''),
                text: formatMessage({
                    id:
                        'csr.ticketType' +
                        groups[key]
                            .replace(/ /g, '')
                            .charAt(0)
                            .toUpperCase() +
                        groups[key].replace(/ /g, '').slice(1),
                    defaultMessage: 'Type: ' + groups[key]
                }),
                attribute: 'type',
                filterValue: groups[key],
                groupId: key
            };
        });

        const filterStatusItems = Object.keys(states).map(key => {
            return {
                id: 'filterItem.status' + states[key].replace(/ /g, ''),
                text: formatMessage({
                    id:
                        'csr.ticketStatus' +
                        states[key]
                            .replace(/ /g, '')
                            .charAt(0)
                            .toUpperCase() +
                        states[key].replace(/ /g, '').slice(1),
                    defaultMessage: 'Status: ' + states[key]
                }),
                attribute: 'status',
                filterValue: states[key],
                groupId: parseInt(key)
            };
        });

        const defaultfilterMethods = [...filterTypeItems, ...filterStatusItems];

        const itemElements = Array.from(defaultfilterMethods, filterItem => {
            const { attribute, filterValue, groupId } = filterItem;

            var isActive = false;

            if (attribute === 'type') {
                isActive = activeFilterByType.includes(groupId);
            } else {
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
    }, [
        expanded,
        groups,
        states,
        classes.root,
        classes.menu,
        classes.menuItem,
        formatMessage,
        handleItemClick,
        activeFilterByType,
        activeFilterByStatus
    ]);

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
