import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import SignInPage from '../signInPage';

jest.mock('@magento/peregrine/lib/talons/SignInPage/useSignInPage', () => ({
    useSignInPage: jest.fn(() => ({
        signInProps: {}
    }))
}));

jest.mock('@magento/venia-ui/lib/components/Head', () => ({
    StoreTitle: () => 'Title'
}));

jest.mock('@magento/venia-ui/lib/components/SignIn', () => props => (
    <mock-SignIn {...props} />
));

const Component = () => {
    return <SignInPage />;
};

describe('#SignInPage', () => {
    it('renders correctly', () => {
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
