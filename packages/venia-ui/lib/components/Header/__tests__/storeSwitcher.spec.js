import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import StoreSwitcher from '../storeSwitcher';
import { useStoreSwitcher } from '@magento/peregrine/lib/talons/Header/useStoreSwitcher';

jest.mock('@magento/peregrine/lib/talons/Header/useStoreSwitcher', () => ({
    useStoreSwitcher: jest.fn()
}));

jest.mock('@magento/venia-ui/lib/classify');

const talonProps = {
    handleSwitchStore: jest.fn(),
    availableStores: new Map([
        ['Store 1', { storeName: 'Store 1', isCurrent: false }],
        ['Store 2', { storeName: 'Store 2', isCurrent: true }],
        ['Store 3', { storeName: 'Store 3', isCurrent: false }],
        [('Store 4', { storeName: 'Store 4', isCurrent: false })]
    ]),
    currentGroupName: 'Group 1',
    currentStoreName: 'Store 2',
    storeGroups: new Map([
        [
            'Group 1',
            [
                { storeName: 'Store 1', isCurrent: false },
                { storeName: 'Store 2', isCurrent: true }
            ]
        ],
        [
            'Group 2',
            [
                { storeName: 'Store 3', isCurrent: false },
                { storeName: 'Store 4', isCurrent: false }
            ]
        ]
    ]),
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

test('does not render group name when there is only one group', () => {
    useStoreSwitcher.mockReturnValueOnce({
        ...talonProps,
        storeGroups: new Map([
            [
                'Group 1',
                [
                    { storeName: 'Store 1', isCurrent: false },
                    { storeName: 'Store 2', isCurrent: true }
                ]
            ]
        ])
    });
    const tree = createTestInstance(<StoreSwitcher {...storeSwitcherProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
