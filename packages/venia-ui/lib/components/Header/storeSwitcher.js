import React from 'react';
import { bool, shape, string } from 'prop-types';

import { useStoreSwitcher } from '@magento/peregrine/lib/talons/Header/useStoreSwitcher';

import { mergeClasses } from '../../classify';
import defaultClasses from './storeSwitcher.css';
import GET_CONFIG_DATA from '../../queries/getStoreConfigData.graphql';
import LoadingIndicator from '../LoadingIndicator';
import { Check, MapPin } from 'react-feather';
import Icon from '../Icon';

const StoreSwitcher = props => {
    const { mobileView } = props;
    const talonProps = useStoreSwitcher({
        query: GET_CONFIG_DATA
    });

    const {
        handleSwitchStore,
        availableStores,
        isLoading,
        storeMenuRef,
        storeMenuTriggerRef,
        storeMenuIsOpen,
        handleTriggerClick
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const className = mobileView ? classes.root_mobile : classes.root;
    const menuClassName = storeMenuIsOpen ? classes.menu_open : classes.menu;
    const triggerClassName = classes.storeSwitcherContainer;

    let children = null;

    if (isLoading) {
        children = <LoadingIndicator classes={{ root: classes.loading }} />;
    }

    if (availableStores) {
        const hasMultipleStores =
            Object.keys(availableStores).length > 1 || null;
        let currentStoreName = null;
        const stores = Object.keys(availableStores).map(storeCode => {
            const isCurrentStore = availableStores[storeCode].is_current;
            const storeName = availableStores[storeCode].storeName;
            const activeIcon = isCurrentStore ? (
                <Icon size={20} src={Check} />
            ) : null;

            if (isCurrentStore) {
                currentStoreName = storeName;
            }

            return (
                <li key={storeCode} className={classes.menuItem}>
                    <button
                        className={classes.menuItemButton}
                        onClick={() => {
                            handleSwitchStore(storeCode);
                        }}
                    >
                        <span className={classes.content}>
                            <span className={classes.text}>{storeName}</span>
                            {activeIcon}
                        </span>
                    </button>
                </li>
            );
        });

        children = hasMultipleStores ? (
            <div className={triggerClassName} ref={storeMenuTriggerRef}>
                <button
                    className={classes.trigger}
                    aria-label={currentStoreName}
                    onClick={handleTriggerClick}
                >
                    <Icon src={MapPin} />
                    <span className={classes.label}>{currentStoreName}</span>
                </button>
                <div ref={storeMenuRef} className={menuClassName}>
                    <ul>{stores}</ul>
                </div>
            </div>
        ) : null;

        if (hasMultipleStores) {
            window.document.documentElement.style.setProperty(
                '--header-height',
                '7.5rem'
            );
        }
    }

    return <div className={className}>{children}</div>;
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
        menuItem: string,
        menuItemButton: string,
        content: string,
        text: string,
        current: string
    }),
    mobileView: bool
};
