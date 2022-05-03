import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { createTestInstance } from '@magento/peregrine';

import AuthRoute from '../authRoute';

jest.mock('react-router-dom', () => ({
    Redirect: props => <mock-Redirect {...props} />,
    Route: props => <mock-Route {...props} />,
    useLocation: jest.fn(() => ({ from: '/from' }))
}));

jest.mock('@magento/peregrine/lib/context/user', () => ({
    useUserContext: jest.fn(() => [{ isSignedIn: false }])
}));

let inputProps = {};

const Component = () => {
    return <AuthRoute {...inputProps} />;
};

const givenDefaultValues = () => {
    inputProps = {
        redirectTo: '/',
        children: []
    };
};

const givenSignedIn = () => {
    useUserContext.mockReturnValueOnce([{ isSignedIn: true }]);
};

describe('#AuthRoute', () => {
    beforeEach(() => {
        givenDefaultValues();
    });

    it('redirects the user on protected route if not signed in', () => {
        const { root } = createTestInstance(<Component />);

        expect(() => root.findByType(Route)).toThrow();
        expect(() => root.findByType(Redirect)).not.toThrow();
    });

    it('renders Route on protected route if signed in', () => {
        givenSignedIn();
        const { root } = createTestInstance(<Component />);

        expect(() => root.findByType(Route)).not.toThrow();
        expect(() => root.findByType(Redirect)).toThrow();
    });
});
