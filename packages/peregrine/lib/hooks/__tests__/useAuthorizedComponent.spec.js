import React from 'react';

import { createTestInstance } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAuthorizedComponent } from '../useAuthorizedComponent';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(() => ({
        push: mockHistoryPush
    }))
}));

jest.mock('@magento/peregrine/lib/context/user', () => ({
    useUserContext: jest.fn(() => [{ isSignedIn: false }])
}));

const Component = () => {
    useAuthorizedComponent();

    return null;
};

const givenSignedIn = () => {
    useUserContext.mockReturnValueOnce([{ isSignedIn: true }]);
};

describe('#useAuthorizedComponent', () => {
    it('redirect the user if not signed in', () => {
        createTestInstance(<Component />);

        expect(mockHistoryPush).toHaveBeenCalled();
    });

    it('does not redirect the user if signed in', () => {
        givenSignedIn();
        createTestInstance(<Component />);

        expect(mockHistoryPush).not.toHaveBeenCalled();
    });
});
