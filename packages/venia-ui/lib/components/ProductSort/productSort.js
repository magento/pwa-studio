import React, { useMemo, useCallback } from 'react';
import { ChevronDown as ArrowDown } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import { array, arrayOf, shape, string } from 'prop-types';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';

import { useStyle } from '../../classify';
import SortItem from './sortItem';
import defaultClasses from './productSort.module.css';
import Button from '../Button';
import Icon from '../Icon';

const ProductSort = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { availableSortMethods, sortProps } = props;
    const [currentSort, setSort] = sortProps;
    const { elementRef, expanded, setExpanded } = useDropdown();
    const { formatMessage } = useIntl();

    const orderSortingList = useCallback(
        list => {
            return list.sort((a, b) => {
                const aText = formatMessage({
                    id: a.id,
                    defaultMessage: a.text
                });
                const bText = formatMessage({
                    id: b.id,
                    defaultMessage: b.text
                });

                return aText.localeCompare(bText, undefined, {
                    sensitivity: 'base'
                });
            });
        },
        [formatMessage]
    );

    const sortMethodsFromConfig = availableSortMethods
        ? availableSortMethods
              .map(method => {
                  const { value, label } = method;
                  if (value !== 'price' && value !== 'position') {
                      return {
                          id: `sortItem.${value}`,
                          text: `${label}`,
                          attribute: value,
                          sortDirection: 'ASC'
                      };
                  }
              })
              .filter(method => !!method)
        : null;

    // click event for menu items
    const handleItemClick = useCallback(
        sortAttribute => {
            setSort({
                sortText: sortAttribute.text,
                sortId: sortAttribute.id,
                sortAttribute: sortAttribute.attribute,
                sortDirection: sortAttribute.sortDirection
            });
            setExpanded(false);
        },
        [setExpanded, setSort]
    );

    const sortElements = useMemo(() => {
        // should be not render item in collapsed mode.
        if (!expanded) {
            return null;
        }

        const defaultSortMethods = [
            {
                id: 'sortItem.relevance',
                text: 'Best Match',
                attribute: 'relevance',
                sortDirection: 'DESC'
            },
            {
                id: 'sortItem.position',
                text: 'Position',
                attribute: 'position',
                sortDirection: 'ASC'
            },
            {
                id: 'sortItem.priceDesc',
                text: 'Price: High to Low',
                attribute: 'price',
                sortDirection: 'DESC'
            },
            {
                id: 'sortItem.priceAsc',
                text: 'Price: Low to High',
                attribute: 'price',
                sortDirection: 'ASC'
            }
        ];

        const allSortingMethods = sortMethodsFromConfig
            ? orderSortingList(
                  [sortMethodsFromConfig, defaultSortMethods].flat()
              )
            : defaultSortMethods;

        const itemElements = Array.from(allSortingMethods, sortItem => {
            const { attribute, sortDirection } = sortItem;
            const isActive =
                currentSort.sortAttribute === attribute &&
                currentSort.sortDirection === sortDirection;

            const key = `${attribute}--${sortDirection}`;
            return (
                <li key={key} className={classes.menuItem}>
                    <SortItem
                        sortItem={sortItem}
                        active={isActive}
                        onClick={handleItemClick}
                    />
                </li>
            );
        });

        return (
            <div className={classes.menu}>
                <ul>{itemElements}</ul>
            </div>
        );
    }, [
        classes.menu,
        classes.menuItem,
        currentSort.sortAttribute,
        currentSort.sortDirection,
        expanded,
        handleItemClick,
        orderSortingList,
        sortMethodsFromConfig
    ]);

    // expand or collapse on click
    const handleSortClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div
            ref={elementRef}
            className={classes.root}
            data-cy="ProductSort-root"
            aria-live="polite"
            aria-busy="false"
        >
            <Button
                priority={'low'}
                classes={{
                    root_lowPriority: classes.sortButton
                }}
                onClick={handleSortClick}
                data-cy="ProductSort-sortButton"
            >
                <span className={classes.mobileText}>
                    <FormattedMessage
                        id={'productSort.sortButton'}
                        defaultMessage={'Sort'}
                    />
                </span>
                <span className={classes.desktopText}>
                    <span className={classes.sortText}>
                        <FormattedMessage
                            id={'productSort.sortByButton'}
                            defaultMessage={'Sort by'}
                        />
                        &nbsp;{currentSort.sortText}
                    </span>
                    <Icon
                        src={ArrowDown}
                        classes={{
                            root: classes.desktopIconWrapper,
                            icon: classes.desktopIcon
                        }}
                    />
                </span>
            </Button>
            {sortElements}
        </div>
    );
};

ProductSort.propTypes = {
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
    ),
    sortProps: array
};

export default ProductSort;
