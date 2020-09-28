import React from 'react';
import { shape, string } from 'prop-types';
import { MapPin } from 'react-feather';

import { useStoreSwitcher } from '@magento/peregrine/lib/talons/Header/useStoreSwitcher';

import { mergeClasses } from '../../classify';
import defaultClasses from './storeSwitcher.css';
import SwitcherItem from './switcherItem';
import storeSwitcherOperations from './storeSwitcher.gql';
import Icon from '../Icon';

const StoreSwitcher = props => {
    const talonProps = useStoreSwitcher({
        ...storeSwitcherOperations
    });

    const {
        handleSwitchStore,
        currentStoreName,
        availableStores,
        storeMenuRef,
        storeMenuTriggerRef,
        storeMenuIsOpen,
        handleTriggerClick
    } = talonProps;

    console.log(currentStoreName);

    const classes = mergeClasses(defaultClasses, props.classes);
    const menuClassName = storeMenuIsOpen ? classes.menu_open : classes.menu;

    if (!availableStores || availableStores.size <= 1) return null;

    const stores = [];

    availableStores.forEach((store, code) => {
        stores.push(
            <li key={code} className={classes.menuItem}>
                <SwitcherItem
                    active={store.isCurrent}
                    onClick={handleSwitchStore}
                    switcherItem={{
                        label: store.storeName,
                        code: code
                    }}
                />
            </li>
        );
    });

    return (
        <div className={classes.root}>
            <button
                className={classes.trigger}
                aria-label={currentStoreName}
                onClick={handleTriggerClick}
                ref={storeMenuTriggerRef}
            >
                <Icon src={MapPin} />
                <span className={classes.label}>{currentStoreName}</span>
            </button>
            <div ref={storeMenuRef} className={menuClassName}>
                <ul>{stores}</ul>
            </div>
        </div>
    );
};

export default StoreSwitcher;

StoreSwitcher.propTypes = {
    classes: shape({
        root: string,
        trigger: string,
        menu: string,
        menu_open: string,
        menuItem: string
    })
};
