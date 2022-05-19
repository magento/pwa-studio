import React from 'react';
import { shape, string } from 'prop-types';

import { useCurrencySwitcher } from '@magento/peregrine/lib/talons/Header/useCurrencySwitcher';

import { useStyle } from '../../classify';
import CurrencySymbol from '../CurrencySymbol';
import defaultClasses from './currencySwitcher.module.css';
import SwitcherItem from './switcherItem';
import Shimmer from './currencySwitcher.shimmer';

const CurrencySwitcher = props => {
    const {
        handleSwitchCurrency,
        currentCurrencyCode,
        availableCurrencies,
        currencyMenuRef,
        currencyMenuTriggerRef,
        currencyMenuIsOpen,
        handleTriggerClick
    } = useCurrencySwitcher();

    const classes = useStyle(defaultClasses, props.classes);
    const menuClassName = currencyMenuIsOpen ? classes.menu_open : classes.menu;

    const currencySymbol = {
        currency: classes.symbol
    };

    if (!availableCurrencies) return <Shimmer />;

    if (availableCurrencies.length === 1) return null;

    const currencies = availableCurrencies.map(code => {
        return (
            <li
                role="option"
                aria-selected={currentCurrencyCode}
                key={code}
                className={classes.menuItem}
            >
                <SwitcherItem
                    active={code === currentCurrencyCode}
                    onClick={handleSwitchCurrency}
                    option={code}
                >
                    <CurrencySymbol
                        classes={currencySymbol}
                        currencyCode={code}
                        currencyDisplay={'narrowSymbol'}
                    />
                    {code}
                </SwitcherItem>
            </li>
        );
    });

    return (
        <div data-cy="CurrencySwitcher-root" className={classes.root}>
            <button
                data-cy="CurrencySwitcher-triggerButton"
                className={classes.trigger}
                aria-label={currentCurrencyCode}
                onClick={handleTriggerClick}
                ref={currencyMenuTriggerRef}
                aria-expanded={currencyMenuIsOpen}
            >
                <span className={classes.label}>
                    <CurrencySymbol
                        classes={currencySymbol}
                        currencyCode={currentCurrencyCode}
                        currencyDisplay={'narrowSymbol'}
                    />
                    {currentCurrencyCode}
                </span>
            </button>
            <div ref={currencyMenuRef} className={menuClassName}>
                <ul role="listbox">{currencies}</ul>
            </div>
        </div>
    );
};

export default CurrencySwitcher;

CurrencySwitcher.propTypes = {
    classes: shape({
        root: string,
        trigger: string,
        menu: string,
        menu_open: string,
        menuItem: string,
        symbol: string
    })
};
