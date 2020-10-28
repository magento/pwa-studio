import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import StoreSwitcher from '../storeSwitcher';
import { useStoreSwitcher } from '@magento/peregrine/lib/talons/Header/useStoreSwitcher';

jest.mock('@magento/peregrine/lib/talons/Header/useStoreSwitcher', () => ({
    useStoreSwitcher: jest.fn()
}));

jest.mock('@magento/peregrine/lib/talons/Header/useStoreSwitcher', () => {});
jest.mock('@magento/venia-ui/lib/classify');

const talonProps = {
    handleSwitchStore: jest.fn(),
    availableStores: new Map([
        ['Store 1', { storeName: 'Store 1', isCurrent: false }],
        ['Store 2', { storeName: 'Store 2', isCurrent: true }]
    ]),
    currentStoreName: 'Store 2',
    storeMenuRef: {},
    storeMenuTriggerRef: {},
    storeMenuIsOpen: false,
    handleTriggerClick: jest.fn()
};

const storeSwitcherProps = {
    mobileView: false
};

test('renders the correct tree', () => {
    useStoreSwitcher.mockReturnValueOnce(talonProps);
    const tree = createTestInstance(<StoreSwitcher {...storeSwitcherProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('does not render StoreSwitcher when there is only one available store', () => {
    useStoreSwitcher.mockReturnValueOnce({
        ...talonProps,
        availableStores: new Map([
            ['Store 1', { storeName: 'Store 1', isCurrent: false }]
        ]),
        currentStoreName: 'Store 1'
    });
    const tree = createTestInstance(<StoreSwitcher {...storeSwitcherProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
