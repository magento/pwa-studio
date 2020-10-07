import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useAccountChip } from '@magento/peregrine/lib/talons/AccountChip/useAccountChip';

import AccountChip from '../accountChip';

jest.mock('../../../classify');

jest.mock('@magento/peregrine/lib/talons/AccountChip/useAccountChip', () => {
    const useAccountChipTalon = jest.requireActual(
        '@magento/peregrine/lib/talons/AccountChip/useAccountChip'
    );
    const spy = jest.spyOn(useAccountChipTalon, 'useAccountChip');

    return Object.assign(useAccountChipTalon, { useAccountChip: spy });
});

const talonProps = {
    currentUser: {},
    isLoadingUserName: false,
    isUserSignedIn: false
};

test('it renders the default fallback correctly', () => {
    // Arrange.
    useAccountChip.mockReturnValueOnce(talonProps);

    // Act.
    const { root } = createTestInstance(<AccountChip />);

    // Assert.
    expect(
        root.find(({ children }) =>
            children.includes(AccountChip.defaultProps.fallbackText)
        )
    ).toBeTruthy();
});

test('it renders a prop fallback correctly', () => {
    // Arrange.
    useAccountChip.mockReturnValueOnce(talonProps);
    const props = {
        fallbackText: 'unit test'
    };

    // Act.
    const { root } = createTestInstance(<AccountChip {...props} />);

    // Assert.
    expect(
        root.find(({ children }) => children.includes(props.fallbackText))
    ).toBeTruthy();
});

test('it renders a user greeting correctly', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        currentUser: { firstname: 'Unit Tester' },
        isLoadingUserName: false,
        isUserSignedIn: true
    };
    useAccountChip.mockReturnValueOnce(myTalonProps);

    // Act.
    const { root } = createTestInstance(<AccountChip />);

    // Assert.
    expect(
        root.find(({ children }) => {
            return children.includes(
                `Hi, ${myTalonProps.currentUser.firstname}`
            );
        })
    ).toBeTruthy();
});

test('it renders a loading indicator when appropriate', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        currentUser: {},
        isLoadingUserName: true,
        isUserSignedIn: true
    };
    useAccountChip.mockReturnValueOnce(myTalonProps);

    const props = {
        shouldIndicateLoading: true
    };

    // Act.
    const instance = createTestInstance(<AccountChip {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

test('it renders fallback text when loading but instructed not to show loading indicator', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        currentUser: {},
        isLoadingUserName: true,
        isUserSignedIn: true
    };
    useAccountChip.mockReturnValueOnce(myTalonProps);

    const props = {
        fallbackText: 'Unit Test',
        shouldIndicateLoading: false
    };

    // Act.
    const { root } = createTestInstance(<AccountChip {...props} />);

    // Assert.
    expect(
        root.find(({ children }) => {
            return children.includes(props.fallbackText);
        })
    ).toBeTruthy();
});
