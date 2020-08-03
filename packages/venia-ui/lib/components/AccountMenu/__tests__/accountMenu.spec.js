import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import AccountMenu from '../accountMenu';
import { VIEWS } from '../../Header/accountTrigger';

jest.mock('../accountMenuItems', () => 'AccountMenuItems');
jest.mock('../../SignIn/signIn', () => 'Singin Component');
jest.mock('../../ForgotPassword', () => 'Forgot Password Component');

const defaultProps = {
    handleSignOut: jest.fn().mockName('handleSignOut'),
    isOpen: true,
    isUserSignedIn: true,
    view: VIEWS.ACCOUNT,
    username: 'goosey_goose'
};

test('it renders AccountMenuItems when the user is signed in', () => {
    // Act.
    const instance = createTestInstance(<AccountMenu {...defaultProps} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

test('it renders SignIn component when the view is SIGNIN', () => {
    const props = {
        ...defaultProps,
        view: VIEWS.SIGNIN
    };

    // Act.
    const instance = createTestInstance(<AccountMenu {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

test('it renders forgot password component when the view is FORGOT_PASSWORD', () => {
    const props = {
        ...defaultProps,
        view: VIEWS.FORGOT_PASSWORD
    };

    // Act.
    const instance = createTestInstance(<AccountMenu {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

test('it renders forgot password component when the view is CREATE_ACCOUNT', () => {
    const props = {
        ...defaultProps,
        view: VIEWS.CREATE_ACCOUNT
    };

    // Act.
    const instance = createTestInstance(<AccountMenu {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
