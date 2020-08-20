import React, { useEffect } from 'react';

import { createTestInstance } from '@magento/peregrine';

import { useMyAccount } from '../useMyAccount';

jest.mock('react-router-dom', () => {
    return {
        ...jest.requireActual('react-router-dom'),
        useLocation: jest.fn(() => ({
            key: '123'
        }))
    };
});
jest.mock('@magento/peregrine/lib/context/app', () => {
    return {
        useAppContext: jest.fn(() => {
            const state = {};
            const api = { closeDrawer: jest.fn() };

            return [state, api];
        })
    };
});

const log = jest.fn();
const Component = props => {
    const talonProps = useMyAccount(props);

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

it('returns the correct shape', () => {
    // Arrange.
    const props = { onSignOut: jest.fn() };

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    expect(log).toHaveBeenCalledWith({
        handleSignOut: expect.any(Function)
    });
});
