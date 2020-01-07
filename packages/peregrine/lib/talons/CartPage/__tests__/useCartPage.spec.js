import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useCartPage } from '../useCartPage';

jest.mock('../../../context/app', () => {
    const state = {};
    const api = {
        toggleDrawer: jest.fn()
    };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});
jest.mock('../../../context/user', () => {
    const state = {
        isSignedIn: false
    };
    const api = {};
    const useUserContext = jest.fn(() => [state, api]);

    return { useUserContext };
});

const log = jest.fn();
const Component = () => {
    const talonProps = useCartPage();

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

test('it returns the proper shape', () => {
    // Act.
    createTestInstance(<Component />);

    // Assert.
    expect(log).toHaveBeenCalledWith({
        handleSignIn: expect.any(Function),
        isSignedIn: expect.any(Boolean)
    });
});
