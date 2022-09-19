import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useNavigation } from '@magento/peregrine/lib/talons/Navigation/useNavigation';

import NavHeader from '../navHeader';
import Navigation from '../navigation';

/*
 * Mocks.
 */

jest.mock('../../../classify');
jest.mock('../../AuthBar', () => () => <i />);
jest.mock('../../AuthModal', () => () => <i />);
jest.mock('../../CategoryTree', () => () => <i />);
jest.mock('../../LoadingIndicator', () => 'LoadingIndicator');
jest.mock('../navHeader', () => () => <i />);
jest.mock('../../Header/storeSwitcher', () => () => 'StoreSwitcher');
jest.mock('../../Header/currencySwitcher', () => () => 'CurrencySwitcher');

jest.mock('@magento/peregrine/lib/talons/Navigation/useNavigation');

jest.mock('react-aria', () => ({
    FocusScope: jest.fn(({ children }) => {
        return children;
    })
}));

jest.mock('../../Portal', () => ({
    Portal: jest.fn(({ children }) => {
        return children;
    })
}));
/*
 * Tests.
 */

const talonProps = {
    catalogActions: {},
    view: 'MENU'
};

test('renders correctly when open', () => {
    useNavigation.mockReturnValueOnce({
        ...talonProps,
        isOpen: true
    });
    const instance = createTestInstance(<Navigation />);

    expect(instance.toJSON()).toMatchSnapshot();
    expect(instance.root.findByProps({ className: 'root_open' })).toBeTruthy();
});

test('renders correctly when closed', () => {
    useNavigation.mockReturnValueOnce({
        ...talonProps,
        isOpen: false
    });

    const instance = createTestInstance(<Navigation />);

    expect(instance.toJSON()).toMatchSnapshot();
    expect(instance.root.findByProps({ className: 'root' })).toBeTruthy();
});

test('authModal is rendered when hasModal is true', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        hasModal: true
    };
    useNavigation.mockReturnValueOnce(myTalonProps);

    // Act.
    const instance = createTestInstance(<Navigation />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

test('view is passed to NavHeader', () => {
    // Arrange.
    const expected = 'UNIT_TEST';
    const myTalonProps = {
        ...talonProps,
        view: expected
    };
    useNavigation.mockReturnValueOnce(myTalonProps);

    // Act.
    const { root } = createTestInstance(<Navigation />);

    // Assert.
    const header = root.findByType(NavHeader);
    expect(header.props.view).toBe(expected);
});
