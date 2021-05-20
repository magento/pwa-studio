import React from 'react';
import { shape, string } from 'prop-types';

import { useStoreSwitcher } from '@magento/peregrine/lib/talons/Header/useStoreSwitcher';

import { useStyle } from '../../classify';
import defaultClasses from './storeSwitcher.css';
import SwitcherItem from './switcherItem';

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
    } = useStoreSwitcher();

    const classes = useStyle(defaultClasses, props.classes);
    const menuClassName = storeMenuIsOpen ? classes.menu_open : classes.menu;

    if (!availableStores || availableStores.size <= 1) return null;

    const groups = [];
    const hasOnlyOneGroup = storeGroups.size === 1;

    storeGroups.forEach((group, key) => {
        const stores = [];
        group.forEach(({ storeGroupName, storeName, isCurrent, code }) => {
            let label;
            if (hasOnlyOneGroup) {
                label = `${storeName}`;
            } else {
                label = `${storeGroupName} - ${storeName}`;
            }
            stores.push(
                <li key={code} className={classes.menuItem}>
                    <SwitcherItem
                        active={isCurrent}
                        onClick={handleSwitchStore}
                        option={code}
                    >
                        {label}
                    </SwitcherItem>
                </li>
            );
        });

        groups.push(
            <ul className={classes.groupList} key={key}>
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
        <div className={classes.root}>
            <button
                className={classes.trigger}
                aria-label={currentStoreName}
                onClick={handleTriggerClick}
                ref={storeMenuTriggerRef}
            >
                {triggerLabel}
            </button>
            <div ref={storeMenuRef} className={menuClassName}>
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
