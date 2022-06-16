import React, { useMemo, useCallback, useEffect } from 'react';
import { ChevronDown as ArrowDown } from 'react-feather';
import { useIntl } from 'react-intl';
import { array, arrayOf, shape, string, oneOf } from 'prop-types';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';

import { useStyle } from '@magento/venia-ui/lib/classify';
import SortItem from '@magento/venia-ui/lib/components/ProductSort/sortItem';
import defaultClasses from './productSort.module.css';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { useDownloadCsvContext } from '../../DownloadCsvProvider/downloadCsvProvider';

const ProductSort = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { setCurrentCatalog } = useDownloadCsvContext();
    let { availableSortMethods, sortProps1 } = props;
    const [currentSort, setSort] = sortProps1;
    const { elementRef, expanded, setExpanded } = useDropdown();
    const { formatMessage } = useIntl();

    useEffect(() => {
        setCurrentCatalog(currentSort.sortId);
    }, [currentSort]);

    availableSortMethods = [
        // {
        //     id: 'fullCatalogPvP',
        //     text: formatMessage({
        //         id: 'fullCatalog',
        //         defaultMessage: 'Full Catalog + PvP'
        //     }),
        //     attribute: 'fullCatalogPvP',
        //     sortDirection: 'ASC'
        // },
        // {
        //     id: 'fullCatalogPersonal',
        //     text: formatMessage({
        //         id: 'fullCatalogPersonal',
        //         defaultMessage: 'Full + Personal'
        //     }),
        //     attribute: 'fullCatalogPersonal',
        //     sortDirection: 'ASC'
        // },
        {
            id: 'thisCatalogPvP',
            text: formatMessage({
                id: 'thisCatalogPvP',
                defaultMessage: 'This Catalog + PvP'
            }),
            attribute: 'thisCatalogPvP',
            sortDirection: 'DESC'
        },
        {
            id: 'thisCatalogPersonal',
            text: formatMessage({
                id: 'thisCatalogPersonal',
                defaultMessage: 'This Catalog + Personal'
            }),
            attribute: 'thisCatalogPersonal',
            sortDirection: 'DESC'
        }
    ];

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
        if (!expanded) {
            return null;
        }

        const itemElements = Array.from(availableSortMethods, sortItem => {
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
            <div className={classes.menu}>
                <ul>{itemElements}</ul>
            </div>
        );
    }, [
        availableSortMethods,
        classes.menu,
        classes.menuItem,
        currentSort.sortAttribute,
        currentSort.sortDirection,
        expanded,
        handleItemClick
    ]);

    const handleSortClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div ref={elementRef} className={classes.root} aria-live="polite" aria-busy="false">
            <Button
                priority={'low'}
                classes={{
                    root_lowPriority: classes.sortButton
                }}
                onClick={handleSortClick}
            >
                <span className={classes.desktopText}>
                    <span className={classes.sortText} />
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

const sortDirections = oneOf(['ASC', 'DESC']);

ProductSort.propTypes = {
    classes: shape({
        menuItem: string,
        menu: string,
        root: string,
        sortButton: string
    }),
    availableSortMethods: arrayOf(
        shape({
            text: string,
            id: string,
            attribute: string,
            sortDirection: sortDirections
        })
    ),
    sortProps: array
};

export default ProductSort;
