import React from 'react';
import TestRenderer from 'react-test-renderer';
import Navigation from '../navigation';
import { MyAccountMenuTrigger } from '../../MyAccountMenuPage';

jest.mock('src/classify');
jest.mock('src/components/CreateAccount');
jest.mock('src/components/ForgotPassword');
jest.mock('src/components/SignIn');
jest.mock('../../MyAccountMenuPage');

const closeDrawer = jest.fn();
const completePasswordReset = jest.fn();
const createAccount = jest.fn();
const getAllCategories = jest.fn();
const getUserDetails = jest.fn();
const resetPassword = jest.fn();

const props = {
    closeDrawer,
    completePasswordReset,
    createAccount,
    getAllCategories,
    getUserDetails,
    resetPassword
};

test('getUserDetails() is called on mount', () => {
    TestRenderer.create(<Navigation {...props} />);

    expect(getUserDetails).toHaveBeenCalledTimes(1);
});

test('authBar renders if user is not signed in', () => {
    const { root } = TestRenderer.create(
        <Navigation {...props} isSignedIn={false} />
    );

    const authBar = root.findAllByProps({ className: 'authBar' });
    const trigger = root.findAllByType(MyAccountMenuTrigger);

    expect(authBar).toHaveLength(1);
    expect(trigger).toHaveLength(0);
});

test('account trigger renders if user is signed in', async () => {
    const { root } = TestRenderer.create(
        <Navigation {...props} isSignedIn={true} />
    );

    const authBar = root.findAllByProps({ className: 'authBar' });
    const trigger = root.findAllByType(MyAccountMenuTrigger);

    expect(authBar).toHaveLength(0);
    expect(trigger).toHaveLength(1);
});
