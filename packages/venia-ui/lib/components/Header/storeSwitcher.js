import React from 'react';
import { shape, string } from 'prop-types';

import { useStoreSwitcher } from '@magento/peregrine/lib/talons/Header/useStoreSwitcher';
import { availableRoutes } from '@magento/venia-ui/lib/components/Routes/routes';

import { useStyle } from '../../classify';
import defaultClasses from './storeSwitcher.module.css';
import SwitcherItem from './switcherItem';
import Shimmer from './storeSwitcher.shimmer';

const StoreSwitcher = props => {
    const {
        availableStores,
        currentGroupName,
        currentStoreName,
        handleSwitchStore,
        storeGroups,
        storeMenuRef,
        storeMenuTriggerRef,
        storeMenuIsOpen,
        handleTriggerClick
    } = useStoreSwitcher({ availableRoutes });

    const classes = useStyle(defaultClasses, props.classes);
    const menuClassName = storeMenuIsOpen ? classes.menu_open : classes.menu;

    if (!availableStores) return <Shimmer />;

    if (availableStores.size <= 1) return null;

    const groups = [];
    const hasOnlyOneGroup = storeGroups.size === 1;

    storeGroups.forEach((group, key) => {
        const stores = [];
        group.forEach(({ storeGroupName, storeName, isCurrent, storeCode }) => {
            let label;
            if (hasOnlyOneGroup) {
                label = `${storeName}`;
            } else {
                label = `${storeGroupName} - ${storeName}`;
            }
            stores.push(
                <li
                    aria-selected={currentStoreName}
                    role="option"
                    key={storeCode}
                    className={classes.menuItem}
                    data-cy="StoreSwitcher-view"
                >
                    <SwitcherItem
                        active={isCurrent}
                        onClick={handleSwitchStore}
                        option={storeCode}
                    >
                        {label}
                    </SwitcherItem>
                </li>
            );
        });

        groups.push(
            <ul
                role="listbox"
                className={classes.groupList}
                key={key}
                data-cy="StoreSwitcher-group"
            >
                {stores}
            </ul>
        );
    });

    let triggerLabel;
    if (hasOnlyOneGroup) {
        triggerLabel = `${currentStoreName}`;
    } else {
        triggerLabel = `${currentGroupName} - ${currentStoreName}`;
    }

    return (
        <div className={classes.root} data-cy="StoreSwitcher-root">
            <button
                data-cy="StoreSwitcher-triggerButton"
                className={classes.trigger}
                aria-label={currentStoreName}
                onClick={handleTriggerClick}
                ref={storeMenuTriggerRef}
                data-cy="StoreSwitcher-trigger"
                aria-expanded={storeMenuIsOpen}
            >
                {triggerLabel}
            </button>
            <div
                ref={storeMenuRef}
                className={menuClassName}
                data-cy="StoreSwitcher-menu"
            >
                <div className={classes.groups}>{groups}</div>
            </div>
        </div>
    );
};

export default StoreSwitcher;

StoreSwitcher.propTypes = {
    classes: shape({
        groupList: string,
        groups: string,
        menu: string,
        menu_open: string,
        menuItem: string,
        root: string,
        trigger: string
    })
};
