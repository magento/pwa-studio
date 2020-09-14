import React from 'react';
import { useHistory } from 'react-router-dom';

import createTestInstance from '../../../util/createTestInstance';
import { useUserContext } from '../../../context/user';
import { useWishlistPage } from '../useWishlistPage';
import { useQuery } from '@apollo/client';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn()
}));
jest.mock('@apollo/client', () => ({
    useQuery: jest.fn().mockReturnValue({})
}));
jest.mock('../../../context/user', () => ({
    useUserContext: jest.fn().mockReturnValue([{ isSignedIn: true }])
}));
jest.mock('../../../hooks/useTypePolicies', () => ({
    useTypePolicies: jest.fn()
}));

const Component = props => {
    const talonProps = useWishlistPage(props);

    return <i talonProps={talonProps} />;
};

const props = {
    queries: {}
};

test('return correct shape', () => {
    const { root } = createTestInstance(<Component {...props} />);
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('unauth redirect to home', () => {
    const mockHistoryPush = jest.fn();
    useHistory.mockReturnValue({ push: mockHistoryPush });
    useUserContext.mockReturnValue([{ isSignedIn: false }]);

    createTestInstance(<Component {...props} />);

    expect(mockHistoryPush).toHaveBeenCalled();
});

test('return wishlist data', () => {
    useQuery.mockReturnValue({
        data: { customer: { wishlists: ['wishlist1', 'wishlist2'] } }
    });

    const { root } = createTestInstance(<Component {...props} />);
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.wishlists).toMatchSnapshot();
});
