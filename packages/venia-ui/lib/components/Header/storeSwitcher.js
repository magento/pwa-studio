import React from 'react';
import { bool, shape, string } from 'prop-types';
import { MapPin } from 'react-feather';

import { useStoreSwitcher } from '@magento/peregrine/lib/talons/Header/useStoreSwitcher';

import { mergeClasses } from '../../classify';
import defaultClasses from './storeSwitcher.css';
import SwitcherItem from './switcherItem';
import GET_CONFIG_DATA from '../../queries/getAvailableStoresConfigData.graphql';
import Icon from '../Icon';

const StoreSwitcher = props => {
    const { mobileView } = props;
    const talonProps = useStoreSwitcher({
        getStoreConfig: GET_CONFIG_DATA
    });

    const {
        handleSwitchStore,
        availableStores,
        storeMenuRef,
        storeMenuTriggerRef,
        storeMenuIsOpen,
        handleTriggerClick
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const className = mobileView ? classes.root_mobile : classes.root;
    const menuClassName = storeMenuIsOpen ? classes.menu_open : classes.menu;

    if (!availableStores || Object.keys(availableStores).length === 1)
        return null;

    let currentStoreName = null;

    const stores = Object.keys(availableStores).map(storeCode => {
        const isActive = availableStores[storeCode].is_current;
        const storeName = availableStores[storeCode].storeName;

        const switcherItem = {
            label: storeName,
            code: storeCode
        };

        if (isActive) {
            currentStoreName = storeName;
        }

        return (
            <li key={storeCode} className={classes.menuItem}>
                <SwitcherItem
                    active={isActive}
                    onClick={handleSwitchStore}
                    switcherItem={switcherItem}
                />
            </li>
        );
    });

    return (
        <div className={className}>
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
        root_mobile: string,
        storeSwitcherContainer: string,
        trigger: string,
        menu: string,
        menu_open: string,
        menuItem: string
    }),
    mobileView: bool
};
