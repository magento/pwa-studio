/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useMemo, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { arrayOf, shape, string } from 'prop-types';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import orderByIcon from './Icons/orderByIcon.svg';

import { useStyle } from '@magento/venia-ui/lib/classify';
import SortItem from './sortItem';
import defaultClasses from './ticketSort.module.css';

import { useTicketSort } from '../../talons/useTicketSort';

const TicketSort = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { sortProps, setMultipleTickets, setOrderBy, setNumPage, setSortBy } = props;
    const [currentSort, setSort] = sortProps;
    const { elementRef, expanded, setExpanded } = useDropdown();
    const { formatMessage } = useIntl();

    const talonProps = useTicketSort({ setMultipleTickets, setOrderBy, setNumPage, setSortBy });
    const { orderByFunction } = talonProps;

    // click event for menu items
    const handleItemClick = useCallback(
        sortId => {
            setSort({
                sortText: sortId.text,
                sortId: sortId.id,
                sortAttribute: sortId.attribute,
                sortDirection: sortId.sortDirection
            });
            setExpanded(false);
            orderByFunction(sortId);
        },
        [setExpanded, setSort, orderByFunction]
    );

    const sortElements = useMemo(() => {
        // should be not render item in collapsed mode.
        if (!expanded) {
            return null;
        }

        const defaultSortMethods = [
            {
                id: 'sortItem.createdDesc',
                text: formatMessage({
                    id: 'sortItem.createdDesc',
                    defaultMessage: 'Creation: Most recent'
                }),
                attribute: 'created_at',
                sortDirection: 'desc'
            },
            {
                id: 'sortItem.createdAsc',
                text: formatMessage({
                    id: 'sortItem.createdAsc',
                    defaultMessage: 'Creation: Oldest'
                }),
                attribute: 'created_at',
                sortDirection: 'asc'
            },
            {
                id: 'sortItem.updateDesc',
                text: formatMessage({
                    id: 'sortItem.updateDesc',
                    defaultMessage: 'Updated: Most recent'
                }),
                attribute: 'updated_at',
                sortDirection: 'desc'
            },
            {
                id: 'sortItem.updateAsc',
                text: formatMessage({
                    id: 'sortItem.updateAsc',
                    defaultMessage: 'Updated: Oldest'
                }),
                attribute: 'updated_at',
                sortDirection: 'asc'
            }
        ];

        const itemElements = Array.from(defaultSortMethods, sortItem => {
            const { attribute, sortDirection } = sortItem;
            const isActive = currentSort.sortAttribute === attribute && currentSort.sortDirection === sortDirection;

            const key = `${attribute}--${sortDirection}`;
            return (
                <li key={key} className={classes.menuItem}>
                    <SortItem sortItem={sortItem} active={isActive} onClick={handleItemClick} />
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
    }, [classes.menu, classes.menuItem, classes.root, expanded, formatMessage, handleItemClick, currentSort]);

    // expand or collapse on click
    const handleSortClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div ref={elementRef}>
            <img src={orderByIcon} alt="sort" onClick={handleSortClick} className={classes.orderByIcon} />
            {sortElements}
        </div>
    );
};

TicketSort.propTypes = {
    classes: shape({
        menuItem: string,
        menu: string,
        root: string,
        sortButton: string
    }),
    availableSortMethods: arrayOf(
        shape({
            label: string,
            value: string
        })
    )
};

export default TicketSort;
