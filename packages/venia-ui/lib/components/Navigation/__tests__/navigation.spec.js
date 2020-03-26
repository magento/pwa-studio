import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
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

jest.mock('@magento/peregrine/lib/context/app', () => {
    const closeDrawer = jest.fn();
    const useAppContext = jest.fn(() => [
        { drawer: 'nav' },
        {
            actions: {},
            closeDrawer
        }
    ]);

    return { useAppContext };
});

jest.mock('@magento/peregrine/lib/context/catalog', () => {
    const updateCategories = jest.fn();
    const useCatalogContext = jest.fn(() => [
        {
            categories: {
                1: { parentId: 0 },
                2: { parentId: 1 }
            },
            rootCategoryId: 1
        },
        {
            actions: { updateCategories }
        }
    ]);

    return { useCatalogContext };
});

jest.mock('@magento/peregrine/lib/context/user', () => {
    const getUserDetails = jest.fn();
    const useUserContext = jest.fn(() => [{}, { getUserDetails }]);

    return { useUserContext };
});

jest.mock('@magento/peregrine/lib/hooks/useAwaitQuery', () => {
    const useAwaitQuery = jest
        .fn()
        .mockResolvedValue({ data: { customer: {} } });

    return { useAwaitQuery };
});

jest.mock('@magento/peregrine/lib/talons/Navigation/useNavigation', () => {
    const useNavigationTalon = jest.requireActual(
        '@magento/peregrine/lib/talons/Navigation/useNavigation'
    );

    const spy = jest.spyOn(useNavigationTalon, 'useNavigation');

    return Object.assign(useNavigationTalon, { useNavigation: spy });
});

/*
 * Tests.
 */

const talonProps = {
    catalogActions: {},
    view: 'MENU'
};

test('renders correctly when open', () => {
    const instance = createTestInstance(<Navigation />);

    expect(instance.toJSON()).toMatchSnapshot();
    expect(instance.root.findByProps({ className: 'root_open' })).toBeTruthy();
});

test('renders correctly when closed', () => {
    useAppContext.mockImplementationOnce(() => [
        { drawer: null },
        { closeDrawer: jest.fn() }
    ]);

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

test('getUserDetails() is called on mount', () => {
    const { getUserDetails } = useUserContext()[1];

    createTestInstance(<Navigation />);

    expect(getUserDetails).toHaveBeenCalledTimes(1);
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
