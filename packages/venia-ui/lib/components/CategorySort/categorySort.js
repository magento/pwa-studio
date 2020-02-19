import React, { useMemo } from 'react';
import { arrayOf, shape, string, func, oneOf } from 'prop-types';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';

import { mergeClasses } from '../../classify';
import CategorySortItem from './categorySortItem';
import defaultClasses from './categorySort.css';

const CategorySort = props => {
    const classes = mergeClasses(defaultClasses);
    const { availableSortMethods, sortControl } = props;
    const { currentSort, setSort } = sortControl;
    const { elementRef, expanded, setExpanded } = useDropdown();

    const sortElements = useMemo(() => {
        const onMenuItemClick = sortAttribute => {
            setSort({
                sortAttribute: sortAttribute.attribute,
                sortDirection: sortAttribute.sortDirection
            });
            setExpanded(false);
        };

        // should be not render item in collapsed mode.
        if (!expanded) {
            return;
        }

        const sortElements = [];
        for (const element of availableSortMethods) {
            const attribute = element.attribute;
            const sortDirection = element.sortDirection;
            const isActive =
                currentSort.sortAttribute === attribute &&
                currentSort.sortDirection === sortDirection;

            const key = `${attribute}--${sortDirection}`;
            sortElements.push(
                <li key={key} className={classes.menuItem}>
                    <CategorySortItem
                        sortItem={element}
                        active={isActive}
                        onClick={function(element) {
                            onMenuItemClick(element);
                        }}
                    />
                </li>
            );
        }

        return (
            <div className={classes.menu}>
                <ul>{sortElements}</ul>
            </div>
        );
    }, [availableSortMethods, classes.menu, classes.menuItem, currentSort.sortAttribute, currentSort.sortDirection, expanded, setExpanded, setSort]);

    // expand or collapse on click
    const handleSortClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div ref={elementRef} className={classes.root}>
            <button onClick={handleSortClick} className={classes.sortButton}>
                {'Sort'}
            </button>
            {sortElements}
        </div>
    );
};

const sortDirections = oneOf(['ASC', 'DESC']);

CategorySort.propTypes = {
    availableSortMethods: arrayOf(
        shape({
            text: string,
            attribute: string,
            sortDirection: sortDirections
        })
    ),
    sortControl: shape({
        currentSort: shape({
            sortAttribute: string,
            sortDirection: sortDirections
        }),
        setSort: func.isRequired
    })
};

CategorySort.defaultProps = {
    availableSortMethods: [
        {
            text: 'Best Match',
            attribute: 'relevance',
            sortDirection: 'ASC'
        },
        {
            text: 'Price: Low to High',
            attribute: 'price',
            sortDirection: 'ASC'
        },
        {
            text: 'Price: High to Low',
            attribute: 'price',
            sortDirection: 'DESC'
        }
    ]
};

export default CategorySort;
