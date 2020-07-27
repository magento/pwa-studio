import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import NavHeader from '../navHeader';

jest.mock('@magento/peregrine/lib/context/user', () => {
    const state = {
        currentUser: null,
        isSignedIn: false
    };
    const api = {};
    const useUserContext = jest.fn(() => [state, api]);

    return { useUserContext };
});

jest.mock('../../../classify');
jest.mock('../../Trigger', () => () => '<Trigger>');

const props = {
    isTopLevel: true,
    onBack: jest.fn(),
    view: 'MENU'
};

test('renders correctly', () => {
    const instance = createTestInstance(<NavHeader {...props} />);

    expect(instance.toJSON()).toMatchSnapshot();
});

describe('derives the title from the view', () => {
    test('default', () => {
        const title = 'Main Menu';
        const { root } = createTestInstance(<NavHeader {...props} view="" />);

        expect(
            root.find(({ children }) => children.includes(title))
        ).toBeTruthy();
    });

    test('CREATE_ACCOUNT', () => {
        const title = 'Create Account';
        const { root } = createTestInstance(
            <NavHeader {...props} view="CREATE_ACCOUNT" />
        );

        expect(
            root.find(({ children }) => children.includes(title))
        ).toBeTruthy();
    });

    test('FORGOT_PASSWORD', () => {
        const title = 'Forgot Password';
        const { root } = createTestInstance(
            <NavHeader {...props} view="FORGOT_PASSWORD" />
        );

        expect(
            root.find(({ children }) => children.includes(title))
        ).toBeTruthy();
    });

    test('MY_ACCOUNT', () => {
        // Arrange.
        const userName = 'Elsa';
        useUserContext.mockReturnValueOnce([
            {
                currentUser: { firstname: userName },
                isSignedIn: true
            },
            {}
        ]);

        // Act.
        const { root } = createTestInstance(
            <NavHeader {...props} view="MY_ACCOUNT" />
        );

        // Assert.
        expect(
            root.find(({ children }) => children.includes(`Hi, ${userName}`))
        ).toBeTruthy();
    });

    test('SIGN_IN', () => {
        const title = 'Account';
        const { root } = createTestInstance(
            <NavHeader {...props} view="SIGN_IN" />
        );

        expect(
            root.find(({ children }) => children.includes(title))
        ).toBeTruthy();
    });
});
