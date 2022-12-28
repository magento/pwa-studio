import React, { useMemo, useCallback } from 'react';
import { ChevronDown as ArrowDown } from 'react-feather';
import { arrayOf, shape, string } from 'prop-types';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import { useStyle } from '@magento/venia-ui/lib/classify';
import SortItem from '@magento/venia-ui/lib/components/ProductSort/sortItem';
import defaultClasses from './CategoryFilter.module.css';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '../../../Icon';

const CategoryFilter = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        availableCategoryItems,
        selectedFilter,
        setSelectedFilter,
        filterName
    } = props;
    const { elementRef, expanded, setExpanded } = useDropdown();

    // click event for menu items
    const handleItemClick = useCallback(
        categoryItem => {
            const tempSelectedFilters = introduceOrRemoveItemFromFilter(
                selectedFilter,
                categoryItem
            );
            setSelectedFilter([...tempSelectedFilters]);
            setExpanded(false);
        },
        [setExpanded, selectedFilter, setSelectedFilter]
    );

    const introduceOrRemoveItemFromFilter = (filterList, item) => {
        const keys = filterList.map(filter => filter.id);
        keys.includes(item.id)
            ? (filterList = filterList.filter(filter => filter.id != item.id))
            : filterList.push(item);
        return filterList;
    };

    const sortElements = useMemo(() => {
        if (!expanded) {
            return null;
        }

        const itemElements = Array.from(availableCategoryItems, item => {
            const { id, text } = item;
            const keys = selectedFilter.map(filter => filter.id);
            const isActive = keys.includes(id);
            const key = `${id}--${text}`;

            return (
                <li key={key} className={classes.menuItem}>
                    <SortItem
                        sortItem={item}
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
        availableCategoryItems,
        classes.menu,
        classes.menuItem,
        expanded,
        handleItemClick,
        selectedFilter
    ]);


    // expand or collapse on click
    const handleSortClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div
            ref={elementRef}
            className={classes.root}
            aria-live="polite"
            aria-busy="false"
        >
            <Button
                priority={'low'}
                classes={{
                    root_lowPriority: classes.sortButton
                }}
                onClick={handleSortClick}
            >
                <span className={classes.mobileText}>{filterName}</span>
                <span className={classes.desktopText}>
                    <span className={classes.sortText}>{filterName}</span>
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

CategoryFilter.propTypes = {
    classes: shape({
        menuItem: string,
        menu: string,
        root: string,
        sortButton: string
    }),
    availableCategoryItems: arrayOf(
        shape({
            text: string,
            id: string
        })
    )
};

export default CategoryFilter;
