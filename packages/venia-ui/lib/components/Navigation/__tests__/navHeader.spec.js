import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import NavHeader from '../navHeader';

jest.mock('../../../classify');
jest.mock('../../Icon', () => () => <i />);
jest.mock('../../Trigger', () => () => <i />);

const props = {
    isTopLevel: true,
    onBack: jest.fn(),
    onClose: jest.fn(),
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
        const title = 'My Account';
        const { root } = createTestInstance(
            <NavHeader {...props} view="MY_ACCOUNT" />
        );

        expect(
            root.find(({ children }) => children.includes(title))
        ).toBeTruthy();
    });

    test('SIGN_IN', () => {
        const title = 'Sign In';
        const { root } = createTestInstance(
            <NavHeader {...props} view="SIGN_IN" />
        );

        expect(
            root.find(({ children }) => children.includes(title))
        ).toBeTruthy();
    });
});
